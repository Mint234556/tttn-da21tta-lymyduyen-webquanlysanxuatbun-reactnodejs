/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <Link href="/nguyen-vat-lieu" className="no-underline">
                    <div className="card mb-0 cursor-pointer">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Nguyên vật liệu</span>
                                <div className="text-900 font-medium text-xl">Quản lý NVL</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Kiểm tra và nhập nguyên vật liệu</span>
                    </div>
                </Link>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <Link href="/cong-thuc" className="no-underline">
                    <div className="card mb-0 cursor-pointer">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Công thức</span>
                                <div className="text-900 font-medium text-xl">Quản lý công thức</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-book text-orange-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Xem và điều chỉnh công thức sản xuất</span>
                    </div>
                </Link>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <Link href="/thanh-pham" className="no-underline">
                    <div className="card mb-0 cursor-pointer">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Thành phẩm</span>
                                <div className="text-900 font-medium text-xl">Quản lý thành phẩm</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-bag text-cyan-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Kiểm tra sản phẩm đã sản xuất</span>
                    </div>
                </Link>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <Link href="/xuat-kho" className="no-underline">
                    <div className="card mb-0 cursor-pointer">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Xuất kho</span>
                                <div className="text-900 font-medium text-xl">Quản lý xuất kho</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-send text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Quản lý đơn hàng xuất kho</span>
                    </div>
                </Link>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Quy trình sản xuất bún</h5>
                    <div className="grid">
                        <div className="col-12">
                            <div className="surface-0">
                                <ul className="list-none p-0 m-0">
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">1. Chuẩn bị nguyên liệu</div>
                                        <div className="text-900 w-6 md:w-10">
                                            <ul className="list-none p-0 m-0">
                                                <li className="flex align-items-center mb-2">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Kiểm tra chất lượng bột gạo</span>
                                                </li>
                                                <li className="flex align-items-center mb-2">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Chuẩn bị nước sạch</span>
                                                </li>
                                                <li className="flex align-items-center">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Chuẩn bị các phụ gia cần thiết</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">2. Trộn bột</div>
                                        <div className="text-900 w-6 md:w-10">
                                            <ul className="list-none p-0 m-0">
                                                <li className="flex align-items-center mb-2">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Trộn bột theo tỷ lệ công thức</span>
                                                </li>
                                                <li className="flex align-items-center">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Nhào bột đều và kỹ</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">3. Tạo sợi bún</div>
                                        <div className="text-900 w-6 md:w-10">
                                            <ul className="list-none p-0 m-0">
                                                <li className="flex align-items-center mb-2">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Ép bột qua khuôn</span>
                                                </li>
                                                <li className="flex align-items-center">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Cắt sợi theo kích thước</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">4. Hoàn thiện</div>
                                        <div className="text-900 w-6 md:w-10">
                                            <ul className="list-none p-0 m-0">
                                                <li className="flex align-items-center mb-2">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Kiểm tra chất lượng sản phẩm</span>
                                                </li>
                                                <li className="flex align-items-center">
                                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                    <span>Đóng gói và bảo quản</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Hình ảnh quy trình</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="card">
                                <img 
                                    src={encodeURI('/images/production/Bún tươi.png')}
                                    alt="Bún tươi" 
                                    className="w-full h-12rem border-round" 
                                    style={{ objectFit: 'cover' }} 
                                />
                                <div className="text-center p-3">
                                    <h6>Nguyên liệu thô</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="card">
                                <img 
                                    src={encodeURI('/images/production/Sản xuất bún.png')}
                                    alt="Sản xuất bún" 
                                    className="w-full h-12rem border-round" 
                                    style={{ objectFit: 'cover' }} 
                                />
                                <div className="text-center p-3">
                                    <h6>Quy trình sản xuất</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
