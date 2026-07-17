import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Temple from './models/Temple.js';
import DarshanSlot from './models/DarshanSlot.js';
import Booking from './models/Booking.js';
import Donation from './models/Donation.js';

dotenv.config();

// Respectful, verified photography links from Wikimedia Commons
const templesData = [
  {
    name: 'Tirumala Venkateswara Temple',
    deity: 'Lord Venkateswara (Balaji)',
    location: 'Tirupati, Andhra Pradesh',
    timings: '03:00 AM - 01:30 AM',
    description: 'Tirumala Venkateswara Temple is a landmark temple in the hill town of Tirumala, near Tirupati in Chittoor district of Andhra Pradesh, India. It is dedicated to Lord Venkateswara, an incarnation of Vishnu.',
    image: 'https://images.unsplash.com/photo-1590050752118-2e863dc0a4d5?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 0
  },
  {
    name: 'Varanasi Kashi Vishwanath Temple',
    deity: 'Lord Shiva (Vishwanatha)',
    location: 'Varanasi, Uttar Pradesh',
    timings: '04:00 AM - 11:00 PM',
    description: 'Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple stands on the western bank of the holy river Ganga.',
    image: 'https://images.unsplash.com/photo-1627885449221-5a3d0fb36f56?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 0
  },
  {
    name: 'Kedarnath Temple',
    deity: 'Lord Shiva',
    location: 'Kedarnath, Uttarakhand',
    timings: '04:00 AM - 09:00 PM',
    description: 'Kedarnath Temple is a Hindu temple dedicated to the Hindu God Shiva. Located on the Garhwal Himalayan range near the Mandakini river, Kedarnath is located in the state of Uttarakhand, India.',
    image: 'https://images.unsplash.com/photo-1626014304675-9276d47d4838?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 1
  },
  {
    name: 'Vaishno Devi Temple',
    deity: 'Goddess Vaishno Devi (Mata Rani)',
    location: 'Katra, Jammu & Kashmir',
    timings: '05:00 AM - 10:00 PM',
    description: 'The Vaishno Devi Temple is a holy Hindu temple dedicated to the Hindu Goddess Adi Shakti, located in Katra at the Trikuta Mountains within Jammu and Kashmir, India.',
    image: 'https://images.unsplash.com/photo-1622080352055-668f44fffcfa?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 1
  },
  {
    name: 'Swaminarayan Akshardham Temple',
    deity: 'Lord Swaminarayan',
    location: 'New Delhi, Delhi',
    timings: '09:30 AM - 08:30 PM',
    description: 'Akshardham is a Hindu temple, and spiritual-cultural campus in Delhi, India. The temple displays millennia of traditional Hindu and Indian culture, spirituality, and architecture.',
    image: 'https://images.unsplash.com/photo-1600055276336-db158cc755b7?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 1
  },
  {
    name: 'Sri Harmandir Sahib (Golden Temple)',
    deity: 'Guru Granth Sahib',
    location: 'Amritsar, Punjab',
    timings: 'Open 24 Hours',
    description: 'The Golden Temple, also known as Harmandir Sahib, meaning "abode of God" or Darbar Sahib, is a Gurdwara located in the city of Amritsar, Punjab, India. It is the preeminent spiritual site of Sikhism.',
    image: 'https://images.unsplash.com/photo-1589139265215-620242277d32?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 2
  },
  {
    name: 'Shree Jagannath Temple',
    deity: 'Lord Jagannath (Vishnu)',
    location: 'Puri, Odisha',
    timings: '05:00 AM - 11:00 PM',
    description: 'The Jagannath Temple is an important Hindu temple dedicated to Jagannath, a form of Sri Krishna, one of the trinity of deities worshiped at the temple, located in Puri, Odisha, India.',
    image: 'https://images.unsplash.com/photo-1595861962386-7e127393d25d?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 2
  },
  {
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi (Parvati)',
    location: 'Madurai, Tamil Nadu',
    timings: '05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM',
    description: 'Meenakshi Sundareswarar Temple is a historic Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai, Tamil Nadu, India. It is dedicated to Goddess Meenakshi, a form of Parvati.',
    image: 'https://images.unsplash.com/photo-1598286950298-295b77fbca5a?auto=format&fit=crop&q=80&w=600',
    organizerIndex: 2
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Temple.deleteMany({});
    await DarshanSlot.deleteMany({});
    await Booking.deleteMany({});
    await Donation.deleteMany({});

    console.log('Cleared existing database records.');

    // Create seed users
    const admin = await User.create({
      name: 'System Admin Pavan',
      email: 'admin@darshanease.com',
      password: 'admin123@Password',
      role: 'ADMIN',
    });

    const org1 = await User.create({
      name: 'Trustee Tirupati & Kashi',
      email: 'organizer@darshanease.com',
      password: 'organizer123@Password',
      role: 'ORGANIZER',
    });

    const org2 = await User.create({
      name: 'Trustee Kedarnath & Katra',
      email: 'organizer2@darshanease.com',
      password: 'organizer123@Password',
      role: 'ORGANIZER',
    });

    const org3 = await User.create({
      name: 'Trustee Amritsar & Puri',
      email: 'organizer3@darshanease.com',
      password: 'organizer123@Password',
      role: 'ORGANIZER',
    });

    const user = await User.create({
      name: 'Pavan Kumar Devotee',
      email: 'user@darshanease.com',
      password: 'user123@Password',
      role: 'USER',
    });

    const organizers = [org1, org2, org3];
    console.log('Created Users.');

    // Create temples and slots
    for (const templeInfo of templesData) {
      const assignedOrganizer = organizers[templeInfo.organizerIndex];

      const temple = await Temple.create({
        name: templeInfo.name,
        deity: templeInfo.deity,
        location: templeInfo.location,
        timings: templeInfo.timings,
        description: templeInfo.description,
        image: templeInfo.image,
        createdBy: assignedOrganizer._id,
      });

      // Precreate slots for today, tomorrow, and day after tomorrow
      const dates = [];
      for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }

      const times = [
        '06:00 AM - 09:00 AM',
        '09:00 AM - 12:00 PM',
        '12:00 PM - 03:00 PM',
        '03:00 PM - 06:00 PM',
        '06:00 PM - 09:00 PM',
      ];

      for (const date of dates) {
        for (const time of times) {
          // General slot
          await DarshanSlot.create({
            temple: temple._id,
            date,
            timeSlot: time,
            capacity: 40,
            availableSlots: 40,
            price: 50,
            type: 'General',
          });

          // VIP slot
          await DarshanSlot.create({
            temple: temple._id,
            date,
            timeSlot: time,
            capacity: 8,
            availableSlots: 8,
            price: 350,
            type: 'VIP',
          });
        }
      }
      console.log(`Seeded slots for ${temple.name}`);
    }

    console.log('Database Seeding Expansion Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
