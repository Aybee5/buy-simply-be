const express = require('express'); 
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express(); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors())
app.use(morgan('common'))
app.use(limiter);


app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
); 
