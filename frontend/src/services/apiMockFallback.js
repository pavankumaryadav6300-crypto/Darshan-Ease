// Intelligent Client-Side Fallback for DarshanEase
// Enables full Login, Registration, Temple Browsing, and Ticket Booking
// on Vercel (or when backend is offline/unreachable) without errors.

import axios from 'axios';

const STORAGE_KEY_PREFIX = 'darshanease_';

const getStorageItem = (key, fallback) => {
  try {
    const val = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, val) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// Seed Temples
const INITIAL_TEMPLES = [
  {
    _id: '6acdf51be78e2d46ebd62501',
    name: 'Tirumala Venkateswara Temple',
    deity: 'Lord Venkateswara (Balaji)',
    location: 'Tirupati, Andhra Pradesh',
    timings: '03:00 AM - 01:30 AM',
    description: 'The Venkateswara Swami Temple is dedicated to Venkateswara, a form of Vishnu, who is believed to have appeared on earth to save mankind from trials and troubles of Kali Yuga.',
    image: '/temples/tirumala.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62502',
    name: 'Varanasi Kashi Vishwanath Temple',
    deity: 'Lord Shiva (Vishwanatha)',
    location: 'Varanasi, Uttar Pradesh',
    timings: '04:00 AM - 11:00 PM',
    description: 'Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Shiva. It is a Hindu pilgrimage site and one of the twelve Jyotirlinga shrines on the holy Ganga river.',
    image: '/temples/kashi.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62503',
    name: 'Kedarnath Temple',
    deity: 'Lord Shiva',
    location: 'Kedarnath, Uttarakhand',
    timings: '04:00 AM - 09:00 PM',
    description: 'Kedarnath Temple is a Hindu temple dedicated to Shiva on the Garhwal Himalayan range near Mandakini river. It is the most sacred of the twelve Jyotirlingas.',
    image: '/temples/kedarnath.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62504',
    name: 'Vaishno Devi Temple',
    deity: 'Goddess Vaishno Devi (Mata Rani)',
    location: 'Katra, Jammu & Kashmir',
    timings: '05:00 AM - 10:00 PM',
    description: 'Vaishno Devi Temple is dedicated to Vaishno Devi, located on Trikuta mountain at an elevation of 5,200 feet.',
    image: '/temples/vaishnodevi.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62505',
    name: 'Swaminarayan Akshardham Temple',
    deity: 'Lord Swaminarayan',
    location: 'New Delhi, Delhi',
    timings: '09:30 AM - 08:30 PM',
    description: 'Swaminarayan Akshardham is a spiritual-cultural campus in Delhi displaying traditional Hindu culture, spirituality, and architecture.',
    image: '/temples/akshardham.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62506',
    name: 'Sri Harmandir Sahib (Golden Temple)',
    deity: 'Guru Granth Sahib',
    location: 'Amritsar, Punjab',
    timings: 'Open 24 Hours',
    description: 'The Golden Temple is the pre-eminent spiritual site of Sikhism, famous for its golden sanctum and continuous free langar serving over 100,000 pilgrims daily.',
    image: '/temples/goldentemple.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62507',
    name: 'Shree Jagannath Temple',
    deity: 'Lord Jagannath (Vishnu)',
    location: 'Puri, Odisha',
    timings: '05:00 AM - 11:00 PM',
    description: 'Important Hindu temple dedicated to Jagannath on the eastern coast of India, famous for the annual Ratha Yatra festival.',
    image: '/temples/jagannath.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62508',
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi (Parvati)',
    location: 'Madurai, Tamil Nadu',
    timings: '05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM',
    description: 'Historic Hindu temple on the southern bank of Vaigai River in Madurai, dedicated to Meenakshi and Sundareswarar with monumental gopurams.',
    image: '/temples/meenakshi.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62509',
    name: 'Khajuraho Group of Monuments',
    deity: 'Various Hindu and Jain deities',
    location: 'Chhatarpur, Madhya Pradesh',
    timings: '08:00 AM - 06:00 PM',
    description: 'UNESCO World Heritage Site famous for nagara-style architectural symbolism and intricate sculptures built by the Chandela dynasty.',
    image: '/temples/khajuraho.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62510',
    name: 'Lingaraja Temple',
    deity: 'Harihara (Shiva and Vishnu)',
    location: 'Bhubaneswar, Odisha',
    timings: '06:00 AM - 09:00 PM',
    description: 'Oldest and largest temple in Bhubaneswar, dedicated to Harihara, showcasing quintessential Kalinga architecture.',
    image: '/temples/lingaraja.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62511',
    name: 'Mahakaleshwar Jyotirlinga',
    deity: 'Lord Shiva (Mahakala)',
    location: 'Ujjain, Madhya Pradesh',
    timings: '03:00 AM - 11:00 PM',
    description: 'Sacred Swayambhu Jyotirlinga situated on the banks of Holy River Shipra in Ujjain, famous for the sacred Bhasma Aarti.',
    image: '/temples/mahakaleshwar.jpg',
  },
  {
    _id: '6acdf51be78e2d46ebd62512',
    name: 'Virupaksha Temple',
    deity: 'Lord Shiva (Virupaksha)',
    location: 'Hampi, Karnataka',
    timings: '06:00 AM - 01:00 PM, 05:00 PM - 09:00 PM',
    description: 'Part of the Group of Monuments at Hampi, UNESCO World Heritage Site, functioning continuously since the 7th century AD.',
    image: '/temples/virupaksha.jpg',
  },
];

// Seed Users
const INITIAL_USERS = [
  {
    _id: '6acdf51be78e2d46ebd62001',
    name: 'Pavan Kumar Devotee',
    email: 'user@darshanease.com',
    password: 'user123@Password',
    role: 'USER',
  },
  {
    _id: '6acdf51be78e2d46ebd62002',
    name: 'System Admin Pavan',
    email: 'admin@darshanease.com',
    password: 'admin123@Password',
    role: 'ADMIN',
  },
  {
    _id: '6acdf51be78e2d46ebd62003',
    name: 'Temple Trustee',
    email: 'organizer@darshanease.com',
    password: 'organizer123@Password',
    role: 'ORGANIZER',
  },
];

// Helper to generate slots for any given date
const generateSlotsForDate = (templeId, dateStr) => {
  const times = [
    '06:00 AM - 09:00 AM',
    '09:00 AM - 12:00 PM',
    '12:00 PM - 03:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 09:00 PM',
  ];

  const slots = [];
  times.forEach((t, idx) => {
    slots.push({
      _id: `slot_${templeId}_${dateStr}_gen_${idx}`,
      temple: templeId,
      date: dateStr,
      timeSlot: t,
      capacity: 40,
      availableSlots: 38,
      price: 50,
      type: 'General',
    });
    slots.push({
      _id: `slot_${templeId}_${dateStr}_vip_${idx}`,
      temple: templeId,
      date: dateStr,
      timeSlot: t,
      capacity: 8,
      availableSlots: 8,
      price: 350,
      type: 'VIP',
    });
  });

  return slots;
};

// Dispatch Mock Responses
export const handleMockApi = (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';

  // Parse path (handles full URL like http://localhost:5000/api/auth/login or relative /api/auth/login)
  const path = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '');

  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch (e) {
      body = {};
    }
  }

  // 1. Auth: POST /auth/login
  if (method === 'post' && path.includes('/auth/login')) {
    const users = getStorageItem('users', INITIAL_USERS);
    const user = users.find(
      (u) => u.email.toLowerCase() === (body.email || '').toLowerCase()
    );

    if (user && user.password === body.password) {
      const token = btoa(JSON.stringify({ id: user._id, role: user.role }));
      setStorageItem('currentUser', user);
      return {
        data: {
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
        status: 200,
      };
    }

    const err = new Error('Invalid email or password');
    err.response = { status: 401, data: { success: false, message: 'Invalid email or password' } };
    throw err;
  }

  // 2. Auth: POST /auth/register
  if (method === 'post' && path.includes('/auth/register')) {
    const users = getStorageItem('users', INITIAL_USERS);
    const existing = users.find(
      (u) => u.email.toLowerCase() === (body.email || '').toLowerCase()
    );

    if (existing) {
      const err = new Error('User already exists');
      err.response = { status: 400, data: { success: false, message: 'User already exists' } };
      throw err;
    }

    const newUser = {
      _id: 'user_' + Date.now(),
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'USER',
    };

    users.push(newUser);
    setStorageItem('users', users);
    setStorageItem('currentUser', newUser);

    const token = btoa(JSON.stringify({ id: newUser._id, role: newUser.role }));
    return {
      data: {
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token,
      },
      status: 201,
    };
  }

  // 3. Auth: GET /auth/me
  if (method === 'get' && path.includes('/auth/me')) {
    const user = getStorageItem('currentUser', INITIAL_USERS[0]);
    return {
      data: {
        success: true,
        data: user,
      },
      status: 200,
    };
  }

  // 4. Temples: GET /temples/:id
  const singleTempleMatch = path.match(/\/temples\/([a-zA-Z0-9_-]+)$/);
  if (method === 'get' && singleTempleMatch) {
    const templeId = singleTempleMatch[1];
    const temples = getStorageItem('temples', INITIAL_TEMPLES);
    const temple = temples.find((t) => t._id === templeId) || temples[0];
    return {
      data: {
        success: true,
        data: temple,
      },
      status: 200,
    };
  }

  // 5. Temples: GET /temples (with search query)
  if (method === 'get' && path.startsWith('/temples')) {
    let temples = getStorageItem('temples', INITIAL_TEMPLES);
    const urlObj = new URL(url, 'http://localhost');
    const search = (urlObj.searchParams.get('search') || '').toLowerCase();

    if (search) {
      temples = temples.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.location.toLowerCase().includes(search) ||
          t.deity.toLowerCase().includes(search)
      );
    }

    return {
      data: {
        success: true,
        count: temples.length,
        data: temples,
      },
      status: 200,
    };
  }

  // 6. Slots: GET /slots/temple/:id?date=YYYY-MM-DD
  const slotsMatch = path.match(/\/slots\/temple\/([a-zA-Z0-9_-]+)/);
  if (method === 'get' && slotsMatch) {
    const templeId = slotsMatch[1];
    const urlObj = new URL(url, 'http://localhost');
    const dateStr = urlObj.searchParams.get('date') || new Date().toISOString().split('T')[0];
    const slots = generateSlotsForDate(templeId, dateStr);

    return {
      data: {
        success: true,
        count: slots.length,
        data: slots,
      },
      status: 200,
    };
  }

  // 7. Bookings: POST /bookings
  if (method === 'post' && path.includes('/bookings')) {
    const bookings = getStorageItem('bookings', []);
    const temples = getStorageItem('temples', INITIAL_TEMPLES);
    const temple = temples.find((t) => t._id === body.templeId) || temples[0];

    const newBooking = {
      _id: 'book_' + Date.now(),
      temple,
      slot: {
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 AM - 12:00 PM',
        type: 'General',
        price: 50,
      },
      devotees: body.devotees || [],
      ticketNumber: 'TKT-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Confirmed',
      totalAmount: (body.devotees?.length || 1) * 50 + (body.prasadamCount || 0) * 30,
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    setStorageItem('bookings', bookings);

    return {
      data: {
        success: true,
        data: newBooking,
      },
      status: 201,
    };
  }

  // 8. Bookings: GET /bookings/my or GET /bookings
  if (method === 'get' && path.includes('/bookings')) {
    const bookings = getStorageItem('bookings', []);
    return {
      data: {
        success: true,
        count: bookings.length,
        data: bookings,
      },
      status: 200,
    };
  }

  // 9. Bookings: PUT /bookings/:id/cancel
  const cancelMatch = path.match(/\/bookings\/([a-zA-Z0-9_-]+)\/cancel/);
  if (method === 'put' && cancelMatch) {
    const bookingId = cancelMatch[1];
    const bookings = getStorageItem('bookings', []);
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      booking.status = 'Cancelled';
      setStorageItem('bookings', bookings);
    }
    return {
      data: {
        success: true,
        data: booking || { status: 'Cancelled' },
      },
      status: 200,
    };
  }

  // 10. Donations: POST /donations
  if (method === 'post' && path.includes('/donations')) {
    const donations = getStorageItem('donations', []);
    const temples = getStorageItem('temples', INITIAL_TEMPLES);
    const temple = temples.find((t) => t._id === body.templeId) || temples[0];

    const newDonation = {
      _id: 'don_' + Date.now(),
      temple,
      devoteeName: body.devoteeName || 'Devotee',
      amount: Number(body.amount) || 100,
      purpose: body.purpose || 'General Donation',
      donatedAt: new Date().toISOString(),
    };

    donations.unshift(newDonation);
    setStorageItem('donations', donations);

    return {
      data: {
        success: true,
        data: newDonation,
      },
      status: 201,
    };
  }

  // 11. Donations: GET /donations or GET /donations/my
  if (method === 'get' && path.includes('/donations')) {
    const donations = getStorageItem('donations', []);
    return {
      data: {
        success: true,
        count: donations.length,
        data: donations,
      },
      status: 200,
    };
  }

  // Default fallback
  return {
    data: { success: true, message: 'Handled by DarshanEase fallback' },
    status: 200,
  };
};

// Install the Interceptor onto Axios
export const initApiMockFallback = () => {
  axios.interceptors.response.use(
    (response) => {
      // If Vercel rewrites a missing /api route to index.html
      if (
        typeof response.data === 'string' &&
        response.data.trim().startsWith('<!doctype html')
      ) {
        console.warn('[DarshanEase Fallback] Intercepted HTML rewrite for API call:', response.config.url);
        return handleMockApi(response.config);
      }
      return response;
    },
    async (error) => {
      const status = error.response ? error.response.status : null;
      // If 404, 405 (Method Not Allowed), or Network Error (no live backend attached)
      if (
        !error.response ||
        status === 404 ||
        status === 405 ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error')
      ) {
        console.warn(`[DarshanEase Fallback] Backend unreachable (${status || 'Network Error'}), using cloud fallback:`, error.config?.url);
        try {
          return handleMockApi(error.config);
        } catch (mockErr) {
          return Promise.reject(mockErr);
        }
      }
      return Promise.reject(error);
    }
  );
};
