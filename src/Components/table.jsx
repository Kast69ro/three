import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const MyPrimeTable = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'KAstro', email: 'fake1@.com', city: 'Moscow', status: false, phone: 8748347 },
    { id: '2', name: 'Bot', email: 'fake2@.com', city: 'Dushanbe', status: true, phone: 9876543 },
    { id: '3', name: 'Ali', email: 'ali@.com', city: 'Bokhtar', status: true, phone: 1234567 }
  ]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    city: { value: null, matchMode: 'equals' }
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdd, setIsAdd] = useState(false);

  const statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  const cityOptions = ['Moscow', 'Dushanbe', 'Bokhtar'];

  const openEditDialog = (user) => {
    setFormData(user);
    setEditDialog(true);
    setIsAdd(false);
  };

  const openAddDialog = () => {
    setFormData({ name: '', email: '', phone: '', city: '', status: true });
    setEditDialog(true);
    setIsAdd(true);
  };

  const saveUser = () => {
    if (isAdd) {
      setUsers((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === formData.id ? formData : u)));
    }
    setEditDialog(false);
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const statusTemplate = (rowData) => (
    <Tag value={rowData.status ? 'Active' : 'Inactive'} severity={rowData.status ? 'success' : 'secondary'} />
  );

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" rounded outlined onClick={() => {
        setSelectedUser(rowData);
        setViewDialog(true);
      }} />
      <Button icon="pi pi-pencil" rounded outlined severity="info" onClick={() => openEditDialog(rowData)} />
      <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteUser(rowData.id)} />
    </div>
  );

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setFilters({ ...filters, global: { value: e.target.value, matchMode: 'contains' } })}
          placeholder="Search"
        />
      </span>
    </div>
  );

  const statusFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={statusOptions}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      placeholder="Select Status"
      showClear
    />
  );

  const cityFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={cityOptions}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      placeholder="Select City"
      showClear
    />
  );

  return (
    <div className="p-4">
      <Button label="Add User" icon="pi pi-plus" onClick={openAddDialog} className="mb-3" />

      <DataTable
        value={users}
        paginator
        rows={5}
        dataKey="id"
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        filterDisplay="menu"
        globalFilterFields={['name', 'email', 'city']}
      >
        <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
        <Column field="email" header="Email" sortable filter filterPlaceholder="Search email" />
        <Column field="city" header="City" sortable filter filterElement={cityFilterTemplate} />
        <Column field="phone" header="Phone" />
        <Column field="status" header="Status" body={statusTemplate} filter filterElement={statusFilterTemplate} />
        <Column body={actionTemplate} header="Actions" style={{ width: '150px' }} />
      </DataTable>

      <Dialog header="User Profile" visible={viewDialog} style={{ width: '400px' }} onHide={() => setViewDialog(false)}>
        <p><b>Name:</b> {selectedUser?.name}</p>
        <p><b>Email:</b> {selectedUser?.email}</p>
        <p><b>Phone:</b> {selectedUser?.phone}</p>
        <p><b>City:</b> {selectedUser?.city}</p>
        <p><b>Status:</b> {selectedUser?.status ? 'Active' : 'Inactive'}</p>
      </Dialog>

      <Dialog header={isAdd ? 'Add User' : 'Edit User'} visible={editDialog} style={{ width: '400px' }} onHide={() => setEditDialog(false)} footer={
        <div>
          <Button label="Cancel" icon="pi pi-times" onClick={() => setEditDialog(false)} className="p-button-text" />
          <Button label="Save" icon="pi pi-check" onClick={saveUser} autoFocus />
        </div>
      }>
        <div className="flex flex-column gap-3">
          <InputText value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
          <InputText value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
          <InputText value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" />
          <Dropdown value={formData.city} options={cityOptions} onChange={(e) => setFormData({ ...formData, city: e.value })} placeholder="Select City" />
          <Dropdown value={formData.status} options={statusOptions} onChange={(e) => setFormData({ ...formData, status: e.value })} placeholder="Status" />
        </div>
      </Dialog>
    </div>
  );
};

export default MyPrimeTable;
