// Validation Helper Middlewares

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Name, email, and password are required'));
  }

  // Email format validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error('Please enter a valid email address'));
  }

  // Password validation: Min 8 chars, at least 1 number, 1 special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    return next(new Error('Password must be at least 8 characters long and contain at least one number and one special character (!@#$%^&*)'));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide email and password'));
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error('Please enter a valid email address'));
  }

  next();
};

export const validateBooking = (req, res, next) => {
  const { templeId, slotId, devotees } = req.body;

  if (!templeId || !slotId) {
    res.status(400);
    return next(new Error('templeId and slotId are required'));
  }

  if (!devotees || !Array.isArray(devotees) || devotees.length === 0) {
    res.status(400);
    return next(new Error('Devotees list must be a non-empty array'));
  }

  const validGenders = ['Male', 'Female', 'Other'];
  const validIdProofs = ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID'];

  for (let i = 0; i < devotees.length; i++) {
    const d = devotees[i];
    if (!d.name || !d.age || !d.gender || !d.idProofType || !d.idProofNumber) {
      res.status(400);
      return next(new Error(`Devotee #${i + 1} is missing required fields (name, age, gender, idProofType, idProofNumber)`));
    }
    
    if (isNaN(d.age) || d.age < 1 || d.age > 120) {
      res.status(400);
      return next(new Error(`Devotee #${i + 1} age must be a valid number between 1 and 120`));
    }

    if (!validGenders.includes(d.gender)) {
      res.status(400);
      return next(new Error(`Devotee #${i + 1} gender must be Male, Female, or Other`));
    }

    if (!validIdProofs.includes(d.idProofType)) {
      res.status(400);
      return next(new Error(`Devotee #${i + 1} ID Proof Type must be Aadhaar Card, PAN Card, Passport, or Voter ID`));
    }

    if (d.idProofNumber.trim().length < 4) {
      res.status(400);
      return next(new Error(`Devotee #${i + 1} ID Proof Number must be at least 4 characters long`));
    }
  }

  next();
};

export const validateDonation = (req, res, next) => {
  const { templeId, amount, devoteeName, purpose } = req.body;

  if (!templeId || !amount || !devoteeName) {
    res.status(400);
    return next(new Error('templeId, amount, and devoteeName are required'));
  }

  if (isNaN(amount) || amount < 10) {
    res.status(400);
    return next(new Error('Donation amount must be at least ₹10'));
  }

  const validPurposes = ['Annadanam', 'Temple Development', 'General Donation', 'Pooja/Seva Fund'];
  if (purpose && !validPurposes.includes(purpose)) {
    res.status(400);
    return next(new Error('Invalid donation purpose selected'));
  }

  next();
};
