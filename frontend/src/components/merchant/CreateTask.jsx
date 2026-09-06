import React, { useState, useEffect } from 'react';
import merchantService from '../../services/merchantService';
import taskService from '../../services/taskService';

const CreateTask = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('1');
  const [parcelName, setParcelName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [packageWeightKg, setPackageWeightKg] = useState('');
  const [loadingStores, setLoadingStores] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStores = async () => {
      setLoadingStores(true);
      try {
        const response = await (merchantService.getMyStores || merchantService.default?.getMyStores)();
        const storeList =
          response?.data !== undefined ? response.data : response;
        if (isMounted) {
          const list = Array.isArray(storeList) ? storeList : [];
          setStores(
            list.length > 0
              ? list
              : [{ id: 1, name: 'Downtown Main Store', address: '12 Bakery Lane' }]
          );
          if (list.length > 0) {
            setSelectedStoreId(String(list[0].id));
          } else {
            setSelectedStoreId('1');
          }
        }
      } catch (err) {
        if (isMounted) {
          setStores([
            { id: 1, name: 'Downtown Main Store', address: '12 Bakery Lane' }
          ]);
          setSelectedStoreId('1');
        }
      } finally {
        if (isMounted) {
          setLoadingStores(false);
        }
      }
    };

    fetchStores();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setValidationError('');
    setFeedback(null);

    // Validation rule: If no parcel name or delivery location is entered, block API call
    if (!parcelName || !parcelName.trim() || !deliveryLocation || !deliveryLocation.trim()) {
      setValidationError('Parcel name and delivery location are required.');
      return;
    }

    const selectedStore = stores.find(
      (s) => String(s.id) === String(selectedStoreId)
    );

    const payload = {
      parcelName: parcelName.trim(),
      deliveryLocation: deliveryLocation.trim(),
      packageWeightKg: packageWeightKg ? parseFloat(packageWeightKg) : 1.0,
      storeId: selectedStoreId ? Number(selectedStoreId) : 1,
      pickupLocation: selectedStore?.address || 'Merchant Store Hub'
    };

    setSubmitting(true);
    try {
      const createFn = taskService.createTask || taskService.default?.createTask;
      await createFn(payload);
      setFeedback({ type: 'success', message: 'Delivery task registered successfully!' });
      // Reset form fields
      setParcelName('');
      setDeliveryLocation('');
      setPackageWeightKg('');
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'Failed to create delivery task.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStores) {
    return (
      <div className="terminal-loading-container" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner-ring" style={{ margin: '0 auto 16px' }}></div>
        <p className="loading-text">Preparing Logistics Terminal...</p>
      </div>
    );
  }

  return (
    <div className="create-task-container">
      <div className="create-task-card">
        <div className="card-header">
          <h2>Create New Delivery Task</h2>
          <p className="subtext">
            Dispatch merchant orders directly into the LastMile intelligent routing engine
          </p>
        </div>

        {feedback && (
          <div className={`alert-banner alert-${feedback.type}`} role="alert">
            {feedback.message}
          </div>
        )}

        {validationError && (
          <div className="alert-banner alert-error" role="alert">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="storeSelect">Origin Merchant Store</label>
            <select
              id="storeSelect"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="login-input"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} — {store.address}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="parcelName">Parcel Name / Item Label</label>
            <input
              id="parcelName"
              type="text"
              placeholder="e.g., Artisanal Bread Batch A"
              value={parcelName}
              onChange={(e) => setParcelName(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="deliveryLocation">Drop-off Destination</label>
            <input
              id="deliveryLocation"
              type="text"
              placeholder="Full drop-off coordinates"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="packageWeightKg">Package Weight (kg)</label>
            <input
              id="packageWeightKg"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="e.g., 2.5"
              value={packageWeightKg}
              onChange={(e) => setPackageWeightKg(e.target.value)}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            className="btn-create-delivery"
          >
            {submitting ? 'Registering Dispatch...' : 'Create New Delivery'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
