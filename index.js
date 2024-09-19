const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataModel  = require('./model/dataSchema')
const Language = require('./model/languageSchema')
const Category = require('./model/categorySchema')
const Country = require('./model/countrySchema')
const Niche = require('./model/nicheSchema')
const Note = require('./model/noteSchema')
const User = require('./model/users')

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection

mongoose.connect('mongodb+srv://hamidesta01:hamid.esta@cluster0.x5xkq.mongodb.net/datadb').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));


// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';



// Register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user in the database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});


// GET request to fetch all records
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST request to add a new record
app.post('/api/data', async (req, res) => {
  const newData = new DataModel({
    price: req.body.price,
    website: req.body.website,
    da: req.body.da,
    pa: req.body.pa,
    spamScore: req.body.spamScore,
    dr: req.body.dr,
    ahrefTraffic: req.body.ahrefTraffic,
    SEMRushTraffic: req.body.SEMRushTraffic,
    type: req.body.type,
    niche: req.body.niche,
    language: req.body.language,
    category: req.body.category,
    country: req.body.country,
  });
  try {
    const savedData = await newData.save();
    res.json(savedData);
  } catch (error) {
    res.status(500).send('Failed to save data');
  }
});

// Delete a language by ID
app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await DataModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Data' });
  }
});

// PUT API for updating an existing site
app.put('/api/data/:id', async (req, res) => {
  try {
    const siteId = req.params.id;
    const updatedData = req.body;

    // Find the site by ID and update it
    const updatedSite = await DataModel.findByIdAndUpdate(siteId, updatedData, { new: true });

    if (!updatedSite) {
      return res.status(404).json({ message: 'Site not found' });
    }

    res.status(200).json(updatedSite);
  } catch (error) {
    console.error('Error updating site:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/api/bulkData', async (req, res) => {
    const bulkData = req.body;
  
    if (!Array.isArray(bulkData)) {
      return res.status(400).json({ error: 'Expected an array of data' });
    }
  
    try {
      // Process and save each item individually
      const savedData = await Promise.all(
        bulkData.map(async (item) => {
          // Helper function to safely convert to a number
          const toNumber = (value) => {
            const num = parseInt(value);
            return isNaN(num) ? 0 : num;  
          };
  
          const newData = new DataModel({
            price: toNumber(item.Price),  
            website: item.Website,
            da: toNumber(item.DA),         
            pa: toNumber(item.PA),         
            spamScore: toNumber(item.SpamScore),         
            dr: toNumber(item.DR),         
            ahrefTraffic: toNumber(item.AhrefTraffic),
            SEMRushTraffic: toNumber(item.SEMRushTraffic),
            type: item.Type,
            niche: item.Niche,
            language: item.Language,
            category: item.Category,
            country: item.Country,
          });
    
          // Save the new data item
          const savedItem = await newData.save();
  
        })
      );
  
      // If all data is saved, send a success response
      res.status(200).json({ message: 'Data saved successfully',  });
    } catch (error) {
      console.error('Error saving bulk data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    }
  });


  // ************************** Language Api's ****************************************8
  
  // POST route to store data
app.post('/api/languages', async (req, res) => {
  try {
    const { langName  , activeindicator } = req.body;
    
    const newLanguage = new Language({ langName, activeindicator });

    const savedLanguage = await newLanguage.save();

    res.status(201).json(savedLanguage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save language data' });
  }
});

// GET request to fetch all records
app.get('/api/languages', async (req, res) => {
  try {
    const data = await Language.find();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a language by ID
app.delete('/api/languages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLanguage = await Language.findByIdAndDelete(id);

    if (!deletedLanguage) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete language' });
  }
});

// Update language by ID
app.put('/api/languages/:id', async (req, res) => {
  const { id } = req.params;
  const { langName, activeindicator } = req.body;

  try {
    const updatedLanguage = await Language.findByIdAndUpdate(
      id,
      {
        langName: langName,
        activeindicator: activeindicator,
      },
    );

    if (!updatedLanguage) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json(updatedLanguage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating language', error });
  }
});

  // ************************** category Api's ****************************************8
  
  // POST route to store data
app.post('/api/category', async (req, res) => {
  try {
    const { categoryName  , activeindicator } = req.body;
    
    const newLanguage = new Category({ categoryName, activeindicator });

    const savedLanguage = await newLanguage.save();

    res.status(201).json(savedLanguage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save language data' });
  }
});

// GET request to fetch all records
app.get('/api/category', async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a language by ID
app.delete('/api/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete language' });
  }
});

// Update language by ID
app.put('/api/category/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryName, activeindicator } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        categoryName: categoryName,
        activeindicator: activeindicator,
      },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating language', error });
  }
});

// ************************** Country Api's ****************************************8

// POST route to store data
app.post('/api/country', async (req, res) => {
  try {
    const { countryName, activeindicator } = req.body;
    
    const newCountry = new Country({ countryName, activeindicator });

    const savedCountry = await newCountry.save();

    res.status(201).json(savedCountry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save country data' });
  }
});

// GET request to fetch all records
app.get('/api/country', async (req, res) => {
  try {
    const data = await Country.find();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a country by ID
app.delete('/api/country/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete country' });
  }
});

// Update country by ID
app.put('/api/country/:id', async (req, res) => {
  const { id } = req.params;
  const { countryName, activeindicator } = req.body;

  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { countryName, activeindicator },
      { new: true } // To return the updated document
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating country', error });
  }
});

// ************************** Niche Api's ****************************************


// POST route to store data
app.post('/api/niche', async (req, res) => {
  try {
    const { nicheName, activeindicator } = req.body;
    
    const newNiche = new Niche({ nicheName, activeindicator });

    const savedNiche = await newNiche.save();

    res.status(201).json(savedNiche);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save niche data' });
  }
});

// GET request to fetch all records
app.get('/api/niche', async (req, res) => {
  try {
    const data = await Niche.find();
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a niche by ID
app.delete('/api/niche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNiche = await Niche.findByIdAndDelete(id);

    if (!deletedNiche) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    res.json({ message: 'Niche deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete niche' });
  }
});

// Update niche by ID
app.put('/api/niche/:id', async (req, res) => {
  const { id } = req.params;
  const { nicheName, activeindicator } = req.body;

  try {
    const updatedNiche = await Niche.findByIdAndUpdate(
      id,
      { nicheName, activeindicator },
      { new: true } // To return the updated document
    );

    if (!updatedNiche) {
      return res.status(404).json({ message: 'Niche not found' });
    }

    res.json(updatedNiche);
  } catch (error) {
    res.status(500).json({ message: 'Error updating niche', error });
  }
});

// POST: Add a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { activeindicator, content } = req.body;
    
    const newNote = new Note({ activeindicator, content });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// GET: Fetch all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE: Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// PUT: Update a note by ID
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { activeindicator, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { activeindicator, content  },
      { new: true } // To return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
