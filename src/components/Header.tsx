"use client";
import React, { useState, useRef, useEffect, JSX } from "react";
import Image from "next/image";
import {
    HomeIcon,
    BellIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ExclamationCircleIcon,
    ArrowLeftOnRectangleIcon,
    ClockIcon, // Untuk H-1 dan H-2
    CheckCircleIcon, // Untuk "Tandai semua dibaca"
    TrashIcon, // Untuk "Hapus notifikasi terbaca"
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Search from "./Search";
import { get } from "@/lib/api/apiService";

interface JwtPayload {
    sub: string; // User ID
    name: string;
    email: string;
}

// Perbarui interface notifikasi
interface NotificationMessage {
    id: string; // ID unik (misalnya dari ID peminjaman)
    message: string;
    type: 'h2_reminder' | 'h1_reminder' | 'overdue_critical'; // Tipe untuk styling
    rawReturnDate: Date; // Simpan tanggal asli untuk sorting
}

const LOCAL_STORAGE_READ_NOTIFS_KEY = "readNotificationIds";

export default function Header(): JSX.Element {
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    
    const [activeNotifications, setActiveNotifications] = useState<NotificationMessage[]>([]);
    const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());

    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    let notifCloseTimeout: ReturnType<typeof setTimeout>;
    let userCloseTimeout: ReturnType<typeof setTimeout>;

    // Load read notifications from localStorage on mount
    useEffect(() => {
        const storedReadIds = localStorage.getItem(LOCAL_STORAGE_READ_NOTIFS_KEY);
        if (storedReadIds) {
            try {
                setReadNotifIds(new Set(JSON.parse(storedReadIds)));
            } catch (e) {
                // Jika parsing gagal, set ke Set kosong
                setReadNotifIds(new Set());
                localStorage.removeItem(LOCAL_STORAGE_READ_NOTIFS_KEY);
            }
        }
    }, []);

    // Update localStorage when readNotifIds changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_READ_NOTIFS_KEY, JSON.stringify(Array.from(readNotifIds)));
    }, [readNotifIds]);
    
    // Mengambil info pengguna dari token
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                setUserId(decodedToken.sub);
                setUserName(decodedToken.name);
                setUserEmail(decodedToken.email);
            } catch (error) {
                handleLogout();
            }
        } else {
            router.push("/auth/user/login");
        }
    }, [router]);

    // Mengambil data buku pinjaman dan membuat notifikasi
    useEffect(() => {
        if (!userId) return;

        const fetchBorrowedBooksAndSetNotifications = async () => {
            try {
                const response = await get<{ data: any[] }>(`/borrowings/history/${userId}`);
                const allBorrowings = response.data || [];
                const currentlyBorrowedItems = allBorrowings.filter(item => !item.returnedDate);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const newNotifications: NotificationMessage[] = [];

                currentlyBorrowedItems.forEach(item => {
                    const bookTitle = item.book?.title || "Buku Tidak Diketahui";
                    const returnDateStr = item.returnDate;
                    
                    if (!returnDateStr) return;

                    const originalReturnDate = new Date(returnDateStr); // Simpan tanggal asli
                    const normalizedReturnDate = new Date(returnDateStr);
                    normalizedReturnDate.setHours(0, 0, 0, 0);

                    const diffTime = normalizedReturnDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    const formattedReturnDate = originalReturnDate.toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                    });

                    if (diffDays === 2) { // H-2 Reminder
                        newNotifications.push({
                            id: `h2-${item.id}`,
                            message: `PENGINGAT: Buku "${bookTitle}" akan jatuh tempo pada ${formattedReturnDate}.`,
                            type: 'h2_reminder',
                            rawReturnDate: originalReturnDate,
                        });
                    } else if (diffDays === 1) { // H-1 Reminder
                        newNotifications.push({
                            id: `h1-${item.id}`,
                            message: `Di mohon Kembalikan Buku Dengan Tepat Waktu "${bookTitle}" pada ${formattedReturnDate}.`,
                            type: 'h1_reminder',
                            rawReturnDate: originalReturnDate,
                        });
                    } else if (diffDays <= 0) { // Jatuh tempo hari ini atau sudah terlewat
                         newNotifications.push({
                            id: `overdue-${item.id}`,
                            message: `PERHATIAN: Batas pengembalian buku "${bookTitle}" adalah ${formattedReturnDate}!`,
                            type: 'overdue_critical',
                            rawReturnDate: originalReturnDate,
                        });
                    }
                });
                // Urutkan notifikasi: overdue dulu, lalu H-1, lalu H-2
                newNotifications.sort((a, b) => a.rawReturnDate.getTime() - b.rawReturnDate.getTime());
                setActiveNotifications(newNotifications);
            } catch (apiError) {
                // Tidak menampilkan error
            }
        };

        fetchBorrowedBooksAndSetNotifications();
        // Set interval untuk refresh notifikasi, misal setiap 5 menit
        const intervalId = setInterval(fetchBorrowedBooksAndSetNotifications, 5 * 60 * 1000);
        return () => clearInterval(intervalId);

    }, [userId]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(notifCloseTimeout);
            clearTimeout(userCloseTimeout);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        router.push("/auth/user/login");
    };

    const markDisplayedNotificationsAsRead = () => {
        setReadNotifIds(prevReadIds => {
            const updatedReadIds = new Set(prevReadIds);
            activeNotifications.forEach(notif => updatedReadIds.add(notif.id));
            return updatedReadIds;
        });
    };

    const handleOpenNotifDropdown = () => {
        setNotifOpen(true);
        markDisplayedNotificationsAsRead();
    };
    
    const handleClearReadNotifications = () => {
        // Hanya tampilkan notifikasi yang belum dibaca
        setActiveNotifications(prevNotifs => prevNotifs.filter(n => !readNotifIds.has(n.id)));
        // Kosongkan juga readNotifIds agar jika ada notif baru dengan ID sama bisa muncul lagi sebagai unread
        // Atau, biarkan readNotifIds tetap agar notif yang sama tidak muncul lagi sampai kondisinya berubah.
        // Untuk saat ini, kita biarkan readNotifIds, sehingga notif yang sama tidak langsung menjadi "unread" lagi.
        setNotifOpen(false); // Tutup dropdown setelah aksi
    };

    function handleNotifMouseLeave() { notifCloseTimeout = setTimeout(() => setNotifOpen(false), 250); } // Waktu timeout sedikit lebih lama
    function handleNotifMouseEnter() { clearTimeout(notifCloseTimeout); } // Hanya clear, buka dengan handleOpenNotifDropdown
    function handleUserMouseLeave() { userCloseTimeout = setTimeout(() => setUserMenuOpen(false), 150); }
    function handleUserMouseEnter() { clearTimeout(userCloseTimeout); setUserMenuOpen(true); }

    const unreadNotificationCount = activeNotifications.filter(n => !readNotifIds.has(n.id)).length;

    return (
        <header className="bg-gray-100 shadow-md relative z-50">
            <div className="flex items-center justify-between px-6 py-4">
                <Link href="/books" passHref>
                    <Image src="/logo.png" alt="E-Pustaka Logo" width={120} height={40} priority />
                </Link>
                <Search />
                <div className="flex items-center space-x-6">
                    <Link href="/books" className="text-gray-600 hover:text-gray-800 flex items-center" aria-label="Beranda">
                        <HomeIcon className="w-6 h-6" />
                    </Link>
                    
                    <div 
                        ref={notifRef} 
                        className="relative flex items-center" 
                        onMouseEnter={() => { clearTimeout(notifCloseTimeout); setNotifOpen(true); markDisplayedNotificationsAsRead();}}
                        onMouseLeave={handleNotifMouseLeave}
                    >
                        <button 
                            className="text-gray-600 hover:text-gray-800 focus:outline-none flex items-center relative" 
                            onClick={handleOpenNotifDropdown} 
                            aria-label="Toggle notifications" 
                            type="button"
                        >
                            <BellIcon className="w-6 h-6" />
                            {unreadNotificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="absolute top-full mt-2 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto"> {/* max-h dan overflow */}
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-gray-800 text-lg">Pemberitahuan</p>
                                    </div>
                                    <hr className="mb-2 border-gray-200" />
                                    {activeNotifications.length > 0 ? (
                                        <>
                                            {activeNotifications.map(notif => (
                                                <div 
                                                    key={notif.id} 
                                                    className={`p-3 my-1.5 rounded-lg shadow-sm 
                                                        ${notif.type === 'overdue_critical' ? 'bg-red-100 border-l-4 border-red-500' : 
                                                        notif.type === 'h1_reminder' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 
                                                        'bg-green-100 border-l-4 border-green-500'}`}
                                                >
                                                    <div className="flex items-start space-x-2">
                                                        {notif.type === 'overdue_critical' ? 
                                                            <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" /> :
                                                            <ClockIcon className={`h-5 w-5 ${notif.type === 'h1_reminder' ? 'text-yellow-600' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                                                        }
                                                        <p className={`text-sm ${
                                                            notif.type === 'overdue_critical' ? 'text-red-700' : 
                                                            notif.type === 'h1_reminder' ? 'text-yellow-700' : 
                                                            'text-green-700'
                                                        }`}>
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col space-y-2">
                                                <button 
                                                    onClick={markDisplayedNotificationsAsRead}
                                                    className="w-full text-sm text-blue-600 hover:text-blue-800 py-1.5 px-3 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4 mr-2"/> Tandai Semua Sudah Dibaca
                                                </button>
                                                <button 
                                                    onClick={handleClearReadNotifications}
                                                    className="w-full text-sm text-gray-600 hover:text-gray-800 py-1.5 px-3 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                                                >
                                                    <TrashIcon className="w-4 h-4 mr-2"/> Hapus Notifikasi Terbaca
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                      <p className="text-center text-sm text-gray-500 py-4">Tidak Ada Notifikasi Baru</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                     {/* User Menu Dropdown (tidak berubah signifikan) */}
                     <div 
                        ref={userRef} 
                        className="relative flex items-center" 
                        onMouseEnter={handleUserMouseEnter} 
                        onMouseLeave={handleUserMouseLeave}
                    >
                        <button 
                            onClick={() => setUserMenuOpen((prev) => !prev)} 
                            className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none" 
                            aria-label="User menu toggle" 
                            type="button"
                        >
                            <UserIcon className="w-6 h-6" />
                        </button>
                        {userMenuOpen && (
                            <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5">
                                <div className="flex items-center p-5 bg-[#466881] rounded-t-2xl text-white">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-5 flex-shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-semibold text-lg leading-tight truncate" title={userName || ""}>{userName || "Nama Pengguna"}</p>
                                        <p className="text-sm opacity-80 leading-snug truncate" title={userEmail || ""}>{userEmail || "email@pengguna.com"}</p>
                                        {userId && (
                                            <Link href={`/user/profile/${userId}`} passHref>
                                                <button className="mt-4 bg-[#789791] text-white text-base px-5 py-2 rounded-full hover:bg-[#8fa69f] transition w-max" type="button">
                                                    Lihat Profil
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-around p-6">
                                    <Link href="/user/bookshelf" className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                                        <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1"><HomeIcon className="w-6 h-6 text-white" /></div>
                                        <span className="text-xs">Rak Pinjam</span>
                                    </Link>
                                    <Link href="/bantuan" className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                                        <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1"><BellIcon className="w-6 h-6 text-white" /></div>
                                        <span className="text-xs">Bantuan</span>
                                    </Link>
                                    <Link href="/reset-password" className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                                        <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1"><ExclamationCircleIcon className="w-6 h-6 text-white" /></div>
                                        <span className="text-xs">Reset Password</span>
                                    </Link>
                                </div>
                                <hr className="border-gray-200" />
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center justify-center text-red-600 hover:text-red-800 p-3 text-sm rounded-b-2xl hover:bg-red-50 transition-colors" 
                                    type="button"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                                    Keluar dari Aplikasi
                                </button>
                            </div>
                        )}
                    </div>
                    <button 
                        className="text-gray-600 hover:text-gray-800 focus:outline-none lg:hidden" 
                        onClick={() => setSearchOpen(!searchOpen)} 
                        aria-label="Toggle mobile search" 
                        type="button"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            {searchOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-100 px-6 py-4 shadow-md lg:hidden">
                    <div className="relative">
                        <input type="text" placeholder="Cari judul buku..." className="w-full rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            )}
        </header>
    );
}