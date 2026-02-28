import app from './app.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Acquisitions service is running on port http://localhost:${PORT}`);
});

