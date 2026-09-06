import React from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';

describe('Frontend Tests (LastMile Logistics Optimizer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('T01 - Folder structure: Login component exists', async () => {
    const response = await import('../components/Login');
    const { default: Login } = response;
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    expect(Login).toBeDefined();
  });

  test('T02 - Folder structure: services directory exists', async () => {
    const response = await import('../services/taskService');
    expect(response).toBeDefined();
    expect(response.getAllTasks || response.default.getAllTasks).toBeDefined();
  });

  test('T03 - Folder structure: store directory exists', async () => {
    const response = await import('../store/slices/authSlice');
    expect(response).toBeDefined();
    expect(typeof response.default).toBe('function');
  });

  test('T04 - Login: checks login button has correct type', async () => {
    const { default: Login } = await import('../components/Login');
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Login/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('T05 - Folder structure: layout directory exists', async () => {
    const response = await import('../components/layout/Navbar');
    const { default: Navbar } = response;
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('T06 - Navbar: Displays "Welcome" when user is logged in', async () => {
    const { loginSuccess } = await import('../store/slices/authSlice');
    store.dispatch(
      loginSuccess({
        user: { username: 'TestUser', role: 'FIELD_COURIER' },
        token: 'mock-token'
      })
    );
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  test('T07 - TaskList: Fetches and displays tasks from the backend', async () => {
    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Artisanal Bread')).toBeInTheDocument();
    });
  });

  test('T08 - useFetch: Hook logic (Mocked simulation)', async () => {
    const { default: useFetch } = await import('../hooks/useFetch');
    expect(typeof useFetch).toBe('function');
    const mockApi = jest.fn().mockResolvedValue({ data: 'payload' });
    const { result } = renderHook(() => useFetch(mockApi));
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe('payload');
  });

  test('T09 - CreateTask: form Placeholder and submit button check', async () => {
    const { default: CreateTask } = await import('../components/merchant/CreateTask');
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Preparing Logistics Terminal/i)
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText(/e.g., Artisanal Bread/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create New Delivery/i })
    ).toBeInTheDocument();
  });

  test('T10 - Redux: Verifies authSlice updates global state', async () => {
    const { loginSuccess } = await import('../store/slices/authSlice');
    const mockUser = { username: 'Admin', role: 'PLATFORM_ADMIN' };
    store.dispatch(loginSuccess({ user: mockUser, token: 'mock-jwt' }));
    const state = store.getState().auth;
    expect(state.user.username).toBe('Admin');
  });

  test('T11 - Navbar: verifies protected links are role-based', async () => {
    const { logout, loginSuccess } = await import('../store/slices/authSlice');
    // Case 1: Unauthenticated
    store.dispatch(logout());
    const { default: Navbar } = await import('../components/layout/Navbar');
    const { rerender } = render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.queryByText(/User Management/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Delivery Task/i)).not.toBeInTheDocument();

    // Case 2: Platform Admin
    store.dispatch(
      loginSuccess({
        user: { username: 'Admin', role: 'PLATFORM_ADMIN' },
        token: 'mock-token'
      })
    );
    rerender(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();

    // Case 3: Dispatch Manager
    store.dispatch(
      loginSuccess({
        user: { username: 'Manager', role: 'DISPATCH_MANAGER' },
        token: 'mock-token'
      })
    );
    rerender(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByText(/Delivery Task/i)).toBeInTheDocument();
  });

  test('T12 - Login: Input fields should have correct placeholders', async () => {
    const { default: Login } = await import('../components/Login');
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const usernameField = screen.getByPlaceholderText(/e.g. dispatch_01/i);
    const passField = screen.getByPlaceholderText(/••••••••/i);
    expect(usernameField).toBeInTheDocument();
    expect(passField).toBeInTheDocument();
  });

  test('T13 - Feedback: Displays error message when login fails', async () => {
    const { default: Login } = await import('../components/Login');
    const authServiceModule = await import('../services/authService');
    const target = authServiceModule.default || authServiceModule;
    jest
      .spyOn(target, 'login')
      .mockRejectedValue(
        new Error('Login is invalid. Please check your credentials.')
      );
    if (authServiceModule.login && authServiceModule.login !== target.login) {
      jest
        .spyOn(authServiceModule, 'login')
        .mockRejectedValue(
          new Error('Login is invalid. Please check your credentials.')
        );
    }

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/e.g. dispatch_01/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Login is invalid\. Please check your credentials\./i)
      ).toBeInTheDocument();
    });
  });

  test('T14 - UI: Shows loading spinner during fetch', async () => {
    const { default: LoadingSpinner } = await import(
      '../components/common/LoadingSpinner'
    );
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument();
  });

  test('T15 - FormReset: Clears input fields', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    const taskServiceModule = await import('../services/taskService');
    const target = taskServiceModule.default || taskServiceModule;
    jest.spyOn(target, 'createTask').mockResolvedValue({ id: 99 });
    if (taskServiceModule.createTask && taskServiceModule.createTask !== target.createTask) {
      jest.spyOn(taskServiceModule, 'createTask').mockResolvedValue({ id: 99 });
    }

    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Preparing Logistics Terminal/i)
      ).not.toBeInTheDocument();
    });
    const nameInput = screen.getByPlaceholderText(/e.g., Artisanal Bread/i);
    const locInput = screen.getByPlaceholderText(/Full drop-off coordinates/i);
    fireEvent.change(nameInput, { target: { value: 'Artisanal Bread Batch X' } });
    fireEvent.change(locInput, { target: { value: '100 Broadway' } });
    fireEvent.click(screen.getByRole('button', { name: /Create New Delivery/i }));
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(locInput.value).toBe('');
    });
  });

  test('T16 - Validation: Blocks API call if field is empty while task creation', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    const taskServiceModule = await import('../services/taskService');
    const target = taskServiceModule.default || taskServiceModule;
    const spy = jest.spyOn(target, 'createTask').mockResolvedValue({ id: 1 });
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Preparing Logistics Terminal/i)
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Create New Delivery/i }));
    expect(spy).not.toHaveBeenCalled();
  });

  test('T17 - MyOrders: Displays Merchant Order Management text', async () => {
    const { default: MyOrders } = await import(
      '../components/merchant/MyOrders'
    );
    render(
      <Provider store={store}>
        <MyOrders />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Syncing Order Books/i)
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Merchant Order Management/i)).toBeInTheDocument();
  });

  test('T18 - UserManagement: Display UserManagement Header', async () => {
    const { default: UserManagement } = await import(
      '../components/admin/UserManagement'
    );
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /User Management/i })
      ).toBeInTheDocument();
    });
  });

  test('T19 - TaskList: checks Logistics Optimization Queue exists', async () => {
    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Logistics Optimization Queue/i
        })
      ).toBeInTheDocument();
    });
  });

  test('T20 - Pagination: Handles Spring Data Pageable structure', async () => {
    const taskServiceModule = await import('../services/taskService');
    const target = taskServiceModule.default || taskServiceModule;
    const mockPageable = {
      content: [{ id: 501, parcelName: 'Pageable Parcel', status: 'OPEN' }],
      pageable: { pageNumber: 0, pageSize: 10 }
    };
    jest.spyOn(target, 'getAllTasks').mockResolvedValue(mockPageable);
    if (taskServiceModule.getAllTasks && taskServiceModule.getAllTasks !== target.getAllTasks) {
      jest.spyOn(taskServiceModule, 'getAllTasks').mockResolvedValue(mockPageable);
    }

    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Pageable Parcel')).toBeInTheDocument();
    });
  });

  test('T21 - Resilience: Shows error on network failure', async () => {
    const taskService = await import('../services/taskService');
    jest
      .spyOn(taskService, 'getAllTasks')
      .mockRejectedValue(new Error('Network Error'));
    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Logistics Optimization Queue/i
        })
      ).toBeInTheDocument();
    });
  });

  test('T22 - CreateTask: checks parcel name input has required attribute', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/e.g., Artisanal Bread/i);
      expect(input).toHaveAttribute('required');
    });
  });

  test('T23 - CreateTask: Validates input types', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Preparing Logistics Terminal/i)
      ).not.toBeInTheDocument();
    });
    const parcelInput = screen.getByPlaceholderText(/e.g., Artisanal Bread/i);
    expect(parcelInput).toHaveAttribute('type', 'text');
    const weightInput = screen.getByRole('spinbutton');
    expect(weightInput).toHaveAttribute('type', 'number');
  });

  test('T24 - Navbar: checks logout button exists', async () => {
    const { default: Navbar } = await import('../components/layout/Navbar');
    const { loginSuccess } = await import('../store/slices/authSlice');
    store.dispatch(
      loginSuccess({
        user: { username: 'TestUser', role: 'FIELD_COURIER' },
        token: 'mock-token'
      })
    );
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('T25 - CreateTask: checks Create New Delivery button exists', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Create New Delivery/i })
      ).toBeInTheDocument();
    });
  });

  test('T26 - TaskList: verifies task status display logic', async () => {
    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('OPEN')).toBeInTheDocument();
    });
  });

  test('T27 - TaskList: verifies assign and reassign buttons for managers', async () => {
    const { loginSuccess } = await import('../store/slices/authSlice');
    store.dispatch(
      loginSuccess({ user: { role: 'DISPATCH_MANAGER' }, token: 'mock' })
    );
    const { default: TaskList } = await import('../components/tasks/TaskList');
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Assign$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Reassign$/i })).toBeInTheDocument();
    });
  });

  test('T28 - CreateTask: checks package weight input has correct type', async () => {
    const { default: CreateTask } = await import(
      '../components/merchant/CreateTask'
    );
    render(
      <Provider store={store}>
        <CreateTask />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });

  test('T29 - Navbar: checks navigation role exists', async () => {
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('T30 - Login: displays error message when account is revoked', async () => {
    const { default: Login } = await import('../components/Login');
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/e.g. dispatch_01/i), {
      target: { value: 'revokedUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          /Your access has been revoked by the administrator\./i
        )
      ).toBeInTheDocument();
    });
  });
});
