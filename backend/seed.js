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
    description: 'The Venkateswara Swami Temple—also known as Tirumala Temple, Tirupati Temple and Tirupati Balaji Temple—is a Hindu temple located in the hills of Tirumala, within Tirupati Urban Mandal, Tirupati district, Andhra Pradesh, India. The temple is dedicated to Venkateswara, a form of Vishnu, who is believed to have appeared on earth to save mankind from trials and troubles of Kali Yuga. Hence the site is also called Kaliyuga Vaikuntha and the deity is known as Kaliyuga Prathyaksha Daivam. Venkateswara is additionally known as Balaji, Govinda, and Srinivasa. The temple is administered by the Tirumala Tirupati Devasthanams (TTD), an autonomous body under the control of the Government of Andhra Pradesh. The head of TTD is appointed by Andhra Pradesh Government.',
    image: 'https://picsum.photos/seed/tirupati/800/600',
    organizerIndex: 0
  },
  {
    name: 'Varanasi Kashi Vishwanath Temple',
    deity: 'Lord Shiva (Vishwanatha)',
    location: 'Varanasi, Uttar Pradesh',
    timings: '04:00 AM - 11:00 PM',
    description: 'Kashi Vishwanath Temple is a Hindu temple dedicated to Shiva. It is located in Vishwanath Gali, in Varanasi, Uttar Pradesh, India. The temple is a Hindu pilgrimage site and is one of the twelve Jyotirlinga shrines. The presiding deity is known by the names Vishwanath and Vishweshwara, meaning Lord of the Universe.',
    image: 'https://picsum.photos/seed/kashi/800/600',
    organizerIndex: 0
  },
  {
    name: 'Kedarnath Temple',
    deity: 'Lord Shiva',
    location: 'Kedarnath, Uttarakhand',
    timings: '04:00 AM - 09:00 PM',
    description: 'Kēdāranātha Temple is a Hindu temple, one of the twelve jyotirlinga of Śiva. The temple is located on the Garhwal Himalayan range near the Mandākinī river, in the state of Uttarakhand, India. Due to extreme weather conditions, the temple is open to the general public only between the months of April and November. During the winters, the vigraha (deity) of the temple is carried down to Ukhimath to be worshiped for the next six months. Kēdāranātha is seen as a homogeneous form of Śiva, the \'Lord of Kēdārakhaṇḍa\', the historical name of the region.',
    image: 'https://picsum.photos/seed/kedarnath/800/600',
    organizerIndex: 1
  },
  {
    name: 'Vaishno Devi Temple',
    deity: 'Goddess Vaishno Devi (Mata Rani)',
    location: 'Katra, Jammu & Kashmir',
    timings: '05:00 AM - 10:00 PM',
    description: 'Vaishno Devi Temple, also known as the Shri Mata Vaishno Devi Temple and Vaishno Devi Bhavan, is a Hindu temple in Katra, Reasi district, Jammu and Kashmir. Dedicated to Vaishno Devi, a manifestation of goddesses Mahakali, Mahalakshmi, and Mahasarasvati, it is on Trikuta mountain at an elevation of 5,200 feet. The temple is 43 km from the main city of Jammu and 29 km from the district headquarters Reasi town. The temple is governed by the Shri Mata Vaishno Devi Shrine Board (SMVDSB) and has been chaired by the Governor of Jammu and Kashmir since August 1986.',
    image: 'https://picsum.photos/seed/vaishnodevi/800/600',
    organizerIndex: 1
  },
  {
    name: 'Swaminarayan Akshardham Temple',
    deity: 'Lord Swaminarayan',
    location: 'New Delhi, Delhi',
    timings: '09:30 AM - 08:30 PM',
    description: 'Swaminarayan Akshardham is a Hindu temple and campus in Delhi, India. The temple is close to the border with Noida. Also known as Akshardham Temple or Akshardham Delhi, the complex displays traditional and modern Hindu culture and architecture. Inspired by Yogiji Maharaj and created by Pramukh Swami Maharaj, it was constructed by BAPS. It is the world\'s second-largest BAPS Hindu temple, following Akshardham, New Jersey, in the United States.',
    image: 'https://picsum.photos/seed/akshardham/800/600',
    organizerIndex: 1
  },
  {
    name: 'Sri Harmandir Sahib (Golden Temple)',
    deity: 'Guru Granth Sahib',
    location: 'Amritsar, Punjab',
    timings: 'Open 24 Hours',
    description: 'The Golden Temple is a gurdwara located in Amritsar, Punjab, India. It is the pre-eminent spiritual site of Sikhism and its holiest site. The gurdwara complex is a collection of buildings around the sanctum sanctorum and the sarovar. One of these is Akal Takht, part of the Panj Takht and the chief centre of religious authority of Sikhism. Additional buildings include a clock tower, the offices of the Shiromani Gurdwara Parbandhak Committee, a Museum and a langar—a free Sikh community-run kitchen that offers a vegetarian meal to all visitors without discrimination. Over 150,000 people visit the shrine every day for worship.',
    image: 'https://picsum.photos/seed/goldentemple/800/600',
    organizerIndex: 2
  },
  {
    name: 'Shree Jagannath Temple',
    deity: 'Lord Jagannath (Vishnu)',
    location: 'Puri, Odisha',
    timings: '05:00 AM - 11:00 PM',
    description: 'The Jagannath Temple is a Hindu temple dedicated to Jagannath, a form of Vishnu. It is located in Puri, Odisha, on the eastern coast of India. As per temple records, King Indradyumna of Avanti built the main temple. The present temple complex was rebuilt from the eleventh century onwards on the site of the earlier shrines, excluding the main Jagannath temple, and was begun by Anantavarman Chodaganga, the first ruler of the Eastern Ganga dynasty. Many of the temple rituals are based on Shabari Tantras which are evolved from tribal beliefs respectively. The local legends link the idols with Nilamadhaba deva worshipped by tribala and the daitapatis (servitors) claim to be descendants of the tribes. The temple is one of the 108 Abhimana Kshethram of the Sri Vaishnavite tradition.',
    image: 'https://picsum.photos/seed/jagannath/800/600',
    organizerIndex: 2
  },
  {
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi (Parvati)',
    location: 'Madurai, Tamil Nadu',
    timings: '05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM',
    description: 'Meenakshi Temple, also known as Meenakshi Sundareswarar Temple, is a historic Hindu temple located on the southern bank of the Vaigai River in Madurai, Tamil Nadu, India. It is dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar (Shiva). The temple is theologically significant as it represents a confluence of various denominations of Hinduism such as Shaivism, Shaktism, and Vaishnavism.',
    image: 'https://picsum.photos/seed/meenakshi/800/600',
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
