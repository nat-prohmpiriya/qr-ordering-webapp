'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Tabs,
  Card,
  Typography,
  Button,
  Space,
  message,
  Spin,
  Transfer,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Modal,
  Popconfirm,
  Tag,
  QRCode,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface Branch {
  _id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email?: string;
  openingHours?: string;
  isActive: boolean;
}

interface MenuItem {
  _id: string;
  name: { th: string; en: string };
  price: number;
  categoryId: { name: { th: string; en: string } };
  isAvailable: boolean;
}

interface TableItem {
  _id: string;
  tableNumber: string;
  zone: string;
  capacity: number;
  qrCode: string;
  isActive: boolean;
}

export default function BranchDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [branchId, setBranchId] = useState<string>('');
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  // Menu Tab
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  // Tables Tab
  const [tables, setTables] = useState<TableItem[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<TableItem | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setBranchId(resolvedParams.id as string);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (branchId) {
      fetchBranch();
      fetchAllMenuItems();
      fetchBranchMenuItems();
      fetchTables();
    }
  }, [branchId]);

  const fetchBranch = async () => {
    try {
      const response = await fetch(`/api/branches/${branchId}`);
      const data = await response.json();

      if (data.success) {
        setBranch(data.data);
      } else {
        message.error('Failed to load branch');
        router.push('/admin/branches');
      }
    } catch (error) {
      message.error('Failed to load branch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu');
      const data = await response.json();

      if (data.success) {
        setAllMenuItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchBranchMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu?branchId=${branchId}`);
      const data = await response.json();

      if (data.success) {
        const menuIds = data.data.map((item: any) => item._id);
        setSelectedMenuKeys(menuIds);
      }
    } catch (error) {
      console.error('Error fetching branch menu:', error);
    }
  };

  const fetchTables = async () => {
    try {
      setTablesLoading(true);
      const response = await fetch(`/api/admin/tables?branchId=${branchId}`);
      const data = await response.json();

      if (data.success) {
        setTables(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setTablesLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    try {
      setMenuLoading(true);

      const response = await fetch(`/api/admin/branches/${branchId}/menu`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemIds: selectedMenuKeys }),
      });

      const data = await response.json();

      if (data.success) {
        message.success('Menu items updated successfully');
      } else {
        message.error(data.error || 'Failed to update menu items');
      }
    } catch (error) {
      message.error('Failed to update menu items');
      console.error(error);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleCreateTable = () => {
    setEditingTable(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setTableModalVisible(true);
  };

  const handleEditTable = (table: TableItem) => {
    setEditingTable(table);
    form.setFieldsValue({
      tableNumber: table.tableNumber,
      zone: table.zone,
      capacity: table.capacity,
      qrCode: table.qrCode,
      isActive: table.isActive,
    });
    setTableModalVisible(true);
  };

  const handleDeleteTable = async (id: string) => {
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
      console.error(error);
    }
  };

  const handleSubmitTable = async (values: any) => {
    try {
      const payload = {
        branchId,
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
          editingTable ? 'Table updated successfully' : 'Table created successfully'
        );
        setTableModalVisible(false);
        form.resetFields();
        fetchTables();
      } else {
        message.error(data.error || 'Failed to save table');
      }
    } catch (error) {
      message.error('Failed to save table');
      console.error(error);
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
      a.download = `QR-${branch?.name}-Table-${selectedTableNumber}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const tableColumns: ColumnsType<TableItem> = [
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      width: 120,
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
      render: (qrCode: string) => <code style={{ fontSize: 12 }}>{qrCode}</code>,
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
            onClick={() => handleEditTable(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this table?"
            onConfirm={() => handleDeleteTable(record._id)}
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

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  if (!branch) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Branch not found</Text>
        </div>
      </AdminLayout>
    );
  }

  const tabItems = [
    {
      key: 'menu',
      label: 'Menu Items',
      children: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Text strong>
              เลือกเมนูที่จะแสดงในสาขา {branch.name}
            </Text>
            <br />
            <Text type="secondary">
              เลื่อนรายการจากซ้ายไปขวาเพื่อเพิ่มเมนูเข้าสาขา
            </Text>
          </div>

          <Transfer
            dataSource={allMenuItems.map((item) => ({
              key: item._id,
              title: `${item.name.th} (${item.name.en}) - ฿${item.price}`,
              description: item.categoryId.name.th,
              disabled: !item.isAvailable,
            }))}
            targetKeys={selectedMenuKeys}
            onChange={setSelectedMenuKeys}
            render={(item) => item.title}
            showSearch
            styles={{
              section: {
                width: '45%',
                height: 500,
              },
            }}
            titles={['Available Menu', 'Branch Menu']}
          />

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveMenu}
              loading={menuLoading}
              size="large"
            >
              Save Menu Configuration
            </Button>
          </div>
        </Card>
      ),
    },
    {
      key: 'tables',
      label: 'Tables',
      children: (
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>Tables in {branch.name}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTable}
            >
              Add Table
            </Button>
          </div>

          <Table
            columns={tableColumns}
            dataSource={tables}
            rowKey="_id"
            loading={tablesLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/branches')}
        >
          Back to Branches
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Title level={2}>{branch.name}</Title>
        <Space orientation="vertical">
          <Text><strong>Slug:</strong> {branch.slug}</Text>
          <Text><strong>Address:</strong> {branch.address}</Text>
          <Text><strong>Phone:</strong> {branch.phone}</Text>
          {branch.email && <Text><strong>Email:</strong> {branch.email}</Text>}
          {branch.openingHours && (
            <Text><strong>Opening Hours:</strong> {branch.openingHours}</Text>
          )}
          <Tag color={branch.isActive ? 'green' : 'red'}>
            {branch.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </Space>
      </Card>

      <Tabs items={tabItems} defaultActiveKey="menu" />

      {/* Table Modal */}
      <Modal
        title={editingTable ? 'Edit Table' : 'Add Table'}
        open={tableModalVisible}
        onCancel={() => setTableModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitTable}>
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
            <Input placeholder="e.g., qr_table_1" />
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
