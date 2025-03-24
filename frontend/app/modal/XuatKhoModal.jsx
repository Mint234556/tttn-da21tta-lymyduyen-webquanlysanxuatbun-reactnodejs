'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import XuatKhoService from '../services/xuatKhoService.mjs';
import ThanhPhamService from '../services/thanhphamService.jsx';
import CongThucService from '../services/congThucService.jsx';
import { Toast } from 'primereact/toast';

const XuatKhoModal = ({ visible, onHide, onSuccess, toast }) => {
  const [ghiChu, setGhiChu] = useState('');
  const [selectedThanhPham, setSelectedThanhPham] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const [chiTiet, setChiTiet] = useState([]);
  const [thanhPham, setThanhPham] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (visible) {
      loadThanhPham();
    }
  }, [visible]);

  const loadThanhPham = async () => {
    try {
      setLoading(true);
      const response = await ThanhPhamService.getAll();
      if (response.success) {
        setThanhPham(response.data);
      }
    } catch (error) {
      console.error('Error loading thanh pham:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách thành phẩm' });
    } finally {
      setLoading(false);
    }
  };

  const checkThanhPhamStatus = async (thanhPhamId) => {
    setCheckingStatus(true);
    try {
      // Kiểm tra xem thành phẩm có công thức không
      const congThucResponse = await CongThucService.getByThanhPhamId(thanhPhamId);
      if (!congThucResponse.success || !congThucResponse.data || congThucResponse.data.length === 0) {
        toast.current?.show({ 
          severity: 'warn', 
          summary: 'Cảnh báo', 
          detail: 'Thành phẩm này chưa có công thức. Vui lòng thêm công thức trước khi xuất kho.'
        });
        return false;
      }
      
      // Kiểm tra số lượng tồn của thành phẩm để xác định đã được sản xuất chưa
      const thanhPhamResponse = await ThanhPhamService.getById(thanhPhamId);
      if (!thanhPhamResponse.success) {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Lỗi', 
          detail: 'Không thể kiểm tra thông tin thành phẩm'
        });
        return false;
      }
      
      // Nếu số lượng tồn = 0 hoặc không có, thì thành phẩm chưa được sản xuất
      if (!thanhPhamResponse.data.So_luong || thanhPhamResponse.data.So_luong <= 0) {
        toast.current?.show({ 
          severity: 'warn', 
          summary: 'Cảnh báo', 
          detail: 'Thành phẩm này chưa được sản xuất. Vui lòng sản xuất trước khi xuất kho.'
        });
        return false;
      }
      
      // Kiểm tra nếu số lượng muốn xuất kho vượt quá số lượng tồn
      if (soLuong > thanhPhamResponse.data.So_luong) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: `Số lượng xuất kho (${soLuong}) vượt quá số lượng tồn kho (${thanhPhamResponse.data.So_luong}).`
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking thanh pham status:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Lỗi', 
        detail: 'Không thể kiểm tra trạng thái thành phẩm'
      });
      return false;
    } finally {
      setCheckingStatus(false);
    }
  };

  const addChiTiet = async () => {
    if (!selectedThanhPham) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn thành phẩm' });
      return;
    }

    if (soLuong <= 0) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải lớn hơn 0' });
      return;
    }

    // Kiểm tra tình trạng công thức và sản xuất
    const statusOk = await checkThanhPhamStatus(selectedThanhPham.Id);
    if (!statusOk) {
      return;
    }

    // Kiểm tra xem thành phẩm đã được thêm vào danh sách chưa
    const existingIndex = chiTiet.findIndex(item => item.Thanh_pham_id === selectedThanhPham.Id);
    
    if (existingIndex >= 0) {
      // Cập nhật số lượng nếu đã tồn tại
      const updatedChiTiet = [...chiTiet];
      updatedChiTiet[existingIndex].So_luong += soLuong;
      setChiTiet(updatedChiTiet);
    } else {
      // Thêm mới nếu chưa tồn tại
      setChiTiet([
        ...chiTiet,
        {
          Thanh_pham_id: selectedThanhPham.Id,
          Ten_thanh_pham: selectedThanhPham.Ten_thanh_pham,
          So_luong: soLuong,
          Don_vi_tinh: selectedThanhPham.Don_vi_tinh
        }
      ]);
    }

    // Reset các trường nhập liệu
    setSelectedThanhPham(null);
    setSoLuong(1);
  };

  const removeChiTiet = (index) => {
    const updatedChiTiet = [...chiTiet];
    updatedChiTiet.splice(index, 1);
    setChiTiet(updatedChiTiet);
  };

  const handleSubmit = async () => {
    if (chiTiet.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng thêm ít nhất một thành phẩm' });
      return;
    }

    try {
      setLoading(true);
      
      // Đảm bảo đúng cấu trúc dữ liệu theo yêu cầu API
      const requestData = {
        Ghi_chu: ghiChu,
        chi_tiet: chiTiet.map(item => ({
          Thanh_pham_id: item.Thanh_pham_id,
          So_luong: parseInt(item.So_luong) // Đảm bảo số lượng là số nguyên
        }))
      };

      console.log('Dữ liệu gửi đi:', JSON.stringify(requestData)); // Log dữ liệu để debug
      
      const response = await XuatKhoService.create(requestData);
      
      if (response.success) {
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Tạo phiếu xuất kho thành công' });
        resetForm();
        onSuccess();
        onHide();
      } else {
        // Hiển thị lỗi trả về từ response nếu có
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Lỗi', 
          detail: response.message || 'Không thể tạo phiếu xuất kho'
        });
      }
    } catch (error) {
      console.error('Error creating phieu xuat kho:', error);
      // Hiển thị chi tiết lỗi từ response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Không thể tạo phiếu xuất kho';
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Lỗi', 
        detail: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGhiChu('');
    setSelectedThanhPham(null);
    setSoLuong(1);
    setChiTiet([]);
  };

  const actionBodyTemplate = (rowData, options) => {
    return (
      <Button 
        icon="pi pi-trash" 
        rounded 
        outlined 
        severity="danger" 
        onClick={() => removeChiTiet(options.rowIndex)} 
      />
    );
  };

  const footer = (
    <div>
      <Button label="Hủy" icon="pi pi-times" outlined onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={handleSubmit} loading={loading} />
    </div>
  );

  return (
    <Dialog 
      header="Tạo phiếu xuất kho" 
      visible={visible} 
      style={{ width: '80vw' }} 
      footer={footer} 
      onHide={onHide}
      className="p-fluid"
    >
      <div className="grid">
        <div className="col-12 mb-4">
          <label htmlFor="ghiChu" className="font-medium mb-3 block">Ghi chú</label>
          <InputTextarea 
            id="ghiChu" 
            value={ghiChu} 
            onChange={(e) => setGhiChu(e.target.value)} 
            rows={3} 
            placeholder="Nhập ghi chú cho phiếu xuất kho"
            className="w-full"
          />
        </div>

        <div className="col-12">
          <div className="flex align-items-center gap-3 mb-3">
            <h4 className="m-0">Thêm chi tiết xuất kho</h4>
            <Button 
              label="Thêm" 
              icon="pi pi-plus" 
              onClick={addChiTiet}
              className="p-button-sm"
              loading={checkingStatus}
              style={{ width: '100px' }}
            />
          </div>
          
          <div className="grid">
            <div className="col-7 field mb-4">
              <label htmlFor="thanhPham" className="font-medium mb-2 block">Thành phẩm</label>
              <Dropdown 
                id="thanhPham" 
                value={selectedThanhPham} 
                onChange={(e) => setSelectedThanhPham(e.value)} 
                options={thanhPham} 
                optionLabel="Ten_thanh_pham" 
                placeholder="Chọn thành phẩm" 
                filter
                className="w-full"
              />
            </div>

            <div className="col-4 field mb-4">
              <label htmlFor="soLuong" className="font-medium mb-2 block">Số lượng</label>
              <div className="p-inputgroup">
                <InputNumber 
                  id="soLuong" 
                  value={soLuong} 
                  onValueChange={(e) => setSoLuong(e.value || 0)} 
                  min={1} 
                  placeholder="Nhập số lượng"
                  showButtons
                  className="w-full"
                  style={{ maxWidth: '150px' }}
                />
                <span className="p-inputgroup-addon">
                  {selectedThanhPham?.Don_vi_tinh || 'Đơn vị'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <h4 className="mb-3">Danh sách thành phẩm xuất kho</h4>
          <DataTable 
            value={chiTiet} 
            emptyMessage="Chưa có thành phẩm nào"
            className="mb-3"
          >
            <Column field="Ten_thanh_pham" header="Tên thành phẩm" />
            <Column field="So_luong" header="Số lượng" style={{ width: '150px' }} />
            <Column field="Don_vi_tinh" header="Đơn vị tính" style={{ width: '150px' }} />
            <Column body={actionBodyTemplate} exportable={false} style={{ width: '80px' }} />
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};

export default XuatKhoModal; 