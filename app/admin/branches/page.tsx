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
  Switch,
  message,
  Typography,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { TextArea } = Input;

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

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form] = Form.useForm();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/branches');
      const data = await response.json();

      if (data.success) {
        setBranches(data.data || []);
      } else {
        message.error(data.error || 'Failed to fetch branches');
      }
    } catch (error) {
      message.error('Failed to fetch branches');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreate = () => {
    setEditingBranch(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    form.setFieldsValue({
      name: branch.name,
      slug: branch.slug,
      address: branch.address,
      phone: branch.phone,
      email: branch.email || '',
      openingHours: branch.openingHours || '',
      isActive: branch.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/branches/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        message.success('Branch deleted successfully');
        fetchBranches();
      } else {
        message.error(data.error || 'Failed to delete branch');
      }
    } catch (error) {
      message.error('Failed to delete branch');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        address: values.address,
        phone: values.phone,
        email: values.email || undefined,
        openingHours: values.openingHours || undefined,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      const url = editingBranch
        ? `/api/admin/branches/${editingBranch._id}`
        : '/api/admin/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          editingBranch
            ? 'Branch updated successfully'
            : 'Branch created successfully'
        );
        setModalVisible(false);
        form.resetFields();
        fetchBranches();
      } else {
        message.error(data.error || 'Failed to save branch');
      }
    } catch (error) {
      message.error('Failed to save branch');
      console.error('Error:', error);
    }
  };

  const columns: ColumnsType<Branch> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      render: (slug: string) => <code>{slug}</code>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 300,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
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
      width: 180,
      render: (_, record: Branch) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this branch?"
            description="This will affect all related tables and orders!"
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
        <Title level={2}>Branches Management</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchBranches}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Branch
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={branches}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingBranch ? 'Edit Branch' : 'Add Branch'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Branch Name"
            rules={[{ required: true, message: 'Please enter branch name' }]}
          >
            <Input placeholder="e.g., Siam Paragon Branch" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { required: true, message: 'Please enter slug' },
              {
                pattern: /^[a-z0-9-]+$/,
                message: 'Slug must be lowercase, numbers, and hyphens only',
              },
            ]}
            extra="URL-friendly identifier (lowercase, no spaces)"
          >
            <Input placeholder="e.g., siam-paragon" disabled={!!editingBranch} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea
              rows={3}
              placeholder="Full address including postal code"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              {
                pattern: /^[0-9]{9,10}$/,
                message: 'Please enter valid phone number (9-10 digits)',
              },
            ]}
          >
            <Input placeholder="e.g., 021234567" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email (Optional)"
            rules={[
              {
                type: 'email',
                message: 'Please enter valid email address',
              },
            ]}
          >
            <Input placeholder="e.g., contact@restaurant.com" />
          </Form.Item>

          <Form.Item name="openingHours" label="Opening Hours (Optional)">
            <TextArea
              rows={2}
              placeholder="e.g., Mon-Fri: 10:00-22:00, Sat-Sun: 09:00-23:00"
            />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
