'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
  Typography,
  Popconfirm,
  QRCode,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface TableItem {
  _id: string;
  branchId: { _id: string; name: string; slug: string };
  tableNumber: string;
  zone: string;
  capacity: number;
  qrCode: string;
  isActive: boolean;
}

interface Branch {
  _id: string;
  name: string;
  slug: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<TableItem | null>(null);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tables');
      const data = await response.json();

      if (data.success) {
        setTables(data.data || []);
      } else {
        message.error(data.error || 'Failed to fetch tables');
      }
    } catch (error) {
      message.error('Failed to fetch tables');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();

      if (data.success) {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchBranches();
  }, []);

  const handleCreate = () => {
    setEditingTable(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (table: TableItem) => {
    setEditingTable(table);
    form.setFieldsValue({
      branchId: table.branchId._id,
      tableNumber: table.tableNumber,
      zone: table.zone,
      capacity: table.capacity,
      qrCode: table.qrCode,
      isActive: table.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tables/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        message.success('Table deleted successfully');
        fetchTables();
      } else {
        message.error(data.error || 'Failed to delete table');
      }
    } catch (error) {
      message.error('Failed to delete table');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        branchId: values.branchId,
        tableNumber: values.tableNumber,
        zone: values.zone,
        capacity: values.capacity,
        qrCode: values.qrCode || undefined,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      const url = editingTable
        ? `/api/admin/tables/${editingTable._id}`
        : '/api/admin/tables';
      const method = editingTable ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          editingTable
            ? 'Table updated successfully'
            : 'Table created successfully'
        );
        setModalVisible(false);
        form.resetFields();
        fetchTables();
      } else {
        message.error(data.error || 'Failed to save table');
      }
    } catch (error) {
      message.error('Failed to save table');
      console.error('Error:', error);
    }
  };

  const handleShowQR = (qrCode: string, tableNumber: string) => {
    setSelectedQrCode(qrCode);
    setSelectedTableNumber(tableNumber);
    setQrModalVisible(true);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = `QR-Table-${selectedTableNumber}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const columns: ColumnsType<TableItem> = [
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      width: 120,
      sorter: (a, b) => a.tableNumber.localeCompare(b.tableNumber),
    },
    {
      title: 'Branch',
      dataIndex: ['branchId', 'name'],
      key: 'branch',
      width: 150,
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
      width: 120,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity: number) => `${capacity} seats`,
    },
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 200,
      render: (qrCode: string) => (
        <code style={{ fontSize: 12 }}>{qrCode}</code>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record: TableItem) => (
        <Space>
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            onClick={() => handleShowQR(record.qrCode, record.tableNumber)}
          >
            QR
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this table?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Tables Management</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchTables}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Table
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tables}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingTable ? 'Edit Table' : 'Add Table'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="branchId"
            label="Branch"
            rules={[{ required: true, message: 'Please select a branch' }]}
          >
            <Select placeholder="Select branch" disabled={!!editingTable}>
              {branches.map((branch) => (
                <Option key={branch._id} value={branch._id}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tableNumber"
            label="Table Number"
            rules={[{ required: true, message: 'Please enter table number' }]}
          >
            <Input placeholder="e.g., T01, A-1, Table 1" />
          </Form.Item>

          <Form.Item
            name="zone"
            label="Zone"
            rules={[{ required: true, message: 'Please enter zone' }]}
          >
            <Input placeholder="e.g., Indoor, Outdoor, VIP" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity (seats)"
            rules={[{ required: true, message: 'Please enter capacity' }]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label="QR Code (Optional)"
            extra="Leave blank to auto-generate"
          >
            <Input placeholder="e.g., qr_siam_table_1" />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title={`QR Code - Table ${selectedTableNumber}`}
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={handleDownloadQR}>
            Download QR Code
          </Button>,
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={400}
      >
        <Card style={{ textAlign: 'center' }}>
          {baseUrl && (
            <>
              <QRCode
                id="qr-canvas"
                value={`${baseUrl}/order/${selectedQrCode}`}
                size={300}
                style={{ margin: '0 auto' }}
              />
              <p style={{ marginTop: 16, wordBreak: 'break-all' }}>
                <strong>URL:</strong>
                <br />
                {baseUrl}/order/{selectedQrCode}
              </p>
              <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Scan this QR code to open the menu for this table
              </p>
            </>
          )}
        </Card>
      </Modal>
    </AdminLayout>
  );
}
