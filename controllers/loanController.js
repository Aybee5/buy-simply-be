const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const loansPath = path.join(__dirname, '../data', 'loans.json');
const loans = JSON.parse(fs.readFileSync(loansPath, 'utf-8'));

exports.getAllLoans = (req, res) => {
  const visibleLoans = loans.map(loan => {
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return loan;
    } else {
      const loanCopy = { ...loan };
      delete loanCopy.applicant.totalLoan;
      return loanCopy;
    }
  });

  if (req.query.status) {
    const filteredLoans = visibleLoans.filter(loan => loan.status === req.query.status);
   return res.status(200).json({ loans: filteredLoans });
  }

  res.status(200).json({ loans: visibleLoans });
};

exports.getUserLoans = (req, res) =>{
  const userLoans = loans.filter(loan => loan.applicant.email === req.params.userEmail);
  if (!userLoans) {
    return res.status(200).json({ loans: [] });
  }
  res.status(200).json({ loans: userLoans });
}

exports.getExpiredLoans = (req, res) =>{
  const expiredLoans = loans.filter(loan => dayjs(loan.maturityDate).isBefore(dayjs()));
  if (!expiredLoans) {
    return res.status(200).json({ loans: [] });
  }
  res.status(200).json({ loans: expiredLoans });
}

exports.deleteLoan = (req, res) => {
  const index = loans.findIndex(loan => loan.id === req.params.loanId);
  if (index === -1) {
    return res.status(404).json({ message: 'Loan not found' });
  }
  loans.splice(index, 1);
  fs.writeFileSync(loansPath, JSON.stringify(loans, null, 2));
  res.status(200).json({ message: 'Loan deleted successfully' });
}