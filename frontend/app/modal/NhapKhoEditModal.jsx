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
import NhapKhoService from '../services/nhapKhoService.mjs';
import NguyenVatLieuService from '../services/nguyenvatlieuService.jsx';
import moment from 'moment-timezone';

const NhapKhoEditModal = ({ visible, onHide, onSuccess, toast, nhapKhoId }) => {
  const [ghiChu, setGhiChu] = useState('');
  const [selectedNVL, setSelectedNVL] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const [chiTiet, setChiTiet] = useState([]);
  const [nguyenVatLieu, setNguyenVatLieu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nhapKhoData, setNhapKhoData] = useState(null);

  useEffect(() => {
    if (visible && nhapKhoId) {
      loadNguyenVatLieu();
      loadNhapKhoData();
    }
  }, [visible, nhapKhoId]);

  const loadNhapKhoData = async () => {
    try {
      setLoading(true);
      const response = await NhapKhoService.getById(nhapKhoId);
      if (response.success) {
        const data = response.data;
        setNhapKhoData(data);
        setGhiChu(data.Ghi_chu || '');
        setChiTiet(data.chi_tiet?.map(item => ({
          Nguyen_vat_lieu_id: item.Nguyen_vat_lieu_id,
          Ten_nguyen_lieu: item.Ten_nguyen_lieu,
          So_luong: item.So_luong,
          Don_vi_tinh: item.Don_vi_tinh
        })) || []);
      }
    } catch (error) {
      console.error('Error loading nhap kho data:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải thông tin phiếu nhập kho' });
    } finally {
      setLoading(false);
    }
  };

  const loadNguyenVatLieu = async () => {
    try {
      setLoading(true);
      const response = await NguyenVatLieuService.getAll();
      if (response.success) {
        setNguyenVatLieu(response.data);
      }
    } catch (error) {
      console.error('Error loading nguyen vat lieu:', error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách nguyên vật liệu' });
    } finally {
      setLoading(false);
    }
  };

  const addChiTiet = () => {
    if (!selectedNVL) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn nguyên vật liệu' });
      return;
    }

    if (soLuong <= 0) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải lớn hơn 0' });
      return;
    }

    const existingIndex = chiTiet.findIndex(item => item.Nguyen_vat_lieu_id === selectedNVL.Id);
    
    if (existingIndex >= 0) {
      const updatedChiTiet = [...chiTiet];
      updatedChiTiet[existingIndex].So_luong += soLuong;
      setChiTiet(updatedChiTiet);
    } else {
      setChiTiet([
        ...chiTiet,
        {
          Nguyen_vat_lieu_id: selectedNVL.Id,
          Ten_nguyen_lieu: selectedNVL.Ten_nguyen_lieu,
          So_luong: soLuong,
          Don_vi_tinh: selectedNVL.Don_vi_tinh
        }
      ]);
    }

    setSelectedNVL(null);
    setSoLuong(1);
  };

  const removeChiTiet = (index) => {
    const updatedChiTiet = [...chiTiet];
    updatedChiTiet.splice(index, 1);
    setChiTiet(updatedChiTiet);
  };

  const handleSubmit = async () => {
    if (chiTiet.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng thêm ít nhất một nguyên vật liệu' });
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        Ghi_chu: ghiChu,
        chi_tiet: chiTiet.map(item => ({
          Nguyen_vat_lieu_id: item.Nguyen_vat_lieu_id,
          So_luong: item.So_luong
        }))
      };

      const response = await NhapKhoService.update(nhapKhoId, requestData);
      
      if (response.success) {
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật phiếu nhập kho thành công' });
        onSuccess();
        onHide();
      } else {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Lỗi', 
          detail: response.message || 'Không thể cập nhật phiếu nhập kho' 
        });
      }
    } catch (error) {
      console.error('Error updating phieu nhap kho:', error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Lỗi', 
        detail: error.response?.data?.message || 'Không thể cập nhật phiếu nhập kho' 
      });
    } finally {
      setLoading(false);
    }
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

  if (!nhapKhoData) {
    return null;
  }

  return (
    <Dialog 
      header={`Chỉnh sửa phiếu nhập kho: ${nhapKhoData.Ma_nhap_kho}`} 
      visible={visible} 
      style={{ width: '80vw' }} 
      footer={footer} 
      onHide={onHide}
      className="nhap-kho-dialog"
    >
      <div className="p-fluid">
        <div className="grid formgrid mb-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '1rem' }}>
          <div className="field col-12 md:col-4 mb-0">
            <label htmlFor="ma" className="font-medium block mb-2">Mã phiếu</label>
            <InputText id="ma" value={nhapKhoData.Ma_nhap_kho || ''} readOnly />
          </div>
          <div className="field col-12 md:col-4 mb-0">
            <label htmlFor="date" className="font-medium block mb-2">Ngày nhập</label>
            <InputText 
              id="date" 
              value={moment(nhapKhoData.Ngay_nhap)
                .tz('Asia/Ho_Chi_Minh')
                .format('DD/MM/YYYY HH:mm')} 
              readOnly 
            />
          </div>
          <div className="field col-12 md:col-4 mb-0">
            <label htmlFor="user" className="font-medium block mb-2">Người nhập</label>
            <InputText id="user" value={nhapKhoData.Nguoi_nhap || ''} readOnly />
          </div>
        </div>
        
        <div className="field col-12 md:col-4 mb-0">
        <label htmlFor="ghiChu" className="font-medium block mb-2">Ghi chú</label>
        <InputTextarea
        id="ghiChu"
        value={ghiChu}
        onChange={(e) => setGhiChu(e.target.value)}
        rows={2}
        placeholder="Nhập ghi chú cho phiếu nhập kho"
        />
       </div>


        <div className="mb-4">
          <div className="flex align-items-center justify-content-between mb-3">
            <h4 className="m-0 text-primary">Thêm chi tiết nhập kho</h4>
            <Button 
              label="Thêm" 
              icon="pi pi-plus" 
              onClick={addChiTiet}
              className="p-button-sm"
              style={{ width: '3cm' }}
            />
          </div>
          <div className="grid formgrid p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div className="field col-12 md:col-6 mb-0">
              <label htmlFor="nguyenVatLieu" className="font-medium block mb-2">Nguyên vật liệu</label>
              <Dropdown 
                id="nguyenVatLieu" 
                value={selectedNVL} 
                onChange={(e) => setSelectedNVL(e.value)} 
                options={nguyenVatLieu} 
                optionLabel="Ten_nguyen_lieu" 
                placeholder="Chọn nguyên vật liệu" 
                filter
                className="w-full"
              />
            </div>

            <div className="field col-12 md:col-6 mb-0">
              <label htmlFor="soLuong" className="font-medium block mb-2">Số lượng</label>
              <div className="p-inputgroup">
                <InputNumber 
                  id="soLuong" 
                  value={soLuong} 
                  onValueChange={(e) => setSoLuong(e.value || 0)} 
                  min={1} 
                  placeholder="Nhập số lượng"
                  showButtons
                  buttonLayout="horizontal"
                  decrementButtonClassName="p-button-secondary"
                  incrementButtonClassName="p-button-secondary"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  style={{ maxWidth: '200px' }}
                />
                <span className="p-inputgroup-addon">
                  {selectedNVL?.Don_vi_tinh || 'Đơn vị'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-primary mb-3">Danh sách nguyên vật liệu nhập kho</h4>
          <DataTable value={chiTiet} emptyMessage="Chưa có nguyên vật liệu nào" className="p-datatable-sm">
            <Column field="Ten_nguyen_lieu" header="Tên nguyên vật liệu" />
            <Column field="So_luong" header="Số lượng" style={{ width: '150px' }} />
            <Column field="Don_vi_tinh" header="Đơn vị tính" style={{ width: '150px' }} />
            <Column body={actionBodyTemplate} exportable={false} style={{ width: '80px' }} />
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};

export default NhapKhoEditModal; 