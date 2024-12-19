const fs = require("fs");
const path = require("path");

// 1. createFolders() - Kiritilgan nomlarga ko'ra folderlar yaratish
function createFolders(...folderNames) {
  if (folderNames.length < 1 || folderNames.length > 100) {
    throw new Error("Parameter count must be between 1 and 100.");
  }

  folderNames.forEach((folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Folder '${folderName}' created.`);
    } else {
      console.log(`Folder '${folderName}' already exists.`);
    }
  });
}

// 2. cars.json file yaratish
const carsFilePath = path.join(__dirname, "cars.json");
if (!fs.existsSync(carsFilePath)) {
  fs.writeFileSync(carsFilePath, "[]", "utf8");
  console.log("cars.json file created.");
}

// 3. cars.json faylga yozuvchi function
function addCar(data) {
  const cars = JSON.parse(fs.readFileSync(carsFilePath, "utf8"));
  cars.push(data);
  fs.writeFileSync(carsFilePath, JSON.stringify(cars, null, 2), "utf8");
  console.log("Car added:", data);
}

// 4. cars.json fayldagi barcha datani o'qish function
function getAllCars() {
  const cars = JSON.parse(fs.readFileSync(carsFilePath, "utf8"));
  return cars;
}

// 5. cars.json fayldan id orqali data o'chirish
function deleteCarById(id) {
  const cars = JSON.parse(fs.readFileSync(carsFilePath, "utf8"));
  const updatedCars = cars.filter((car) => car.id !== id);
  fs.writeFileSync(carsFilePath, JSON.stringify(updatedCars, null, 2), "utf8");
  console.log(`Car with id=${id} deleted.`);
}

// Stream bilan ishlash
// Read Stream
function readCarsStream() {
  const readStream = fs.createReadStream(carsFilePath, "utf8");
  readStream.on("data", (chunk) => {
    console.log("Reading chunk:", chunk);
  });
  readStream.on("end", () => {
    console.log("Stream ended.");
  });
}

// Write Stream
function writeCarsStream(data) {
  const writeStream = fs.createWriteStream(carsFilePath, { flags: "a" });
  writeStream.write(JSON.stringify(data, null, 2) + "\n");
  writeStream.end();
  console.log("Data written to file using stream:", data);
}

// Delete Stream example (file truncation)
function truncateCarsFile() {
  fs.truncate(carsFilePath, 0, () => {
    console.log("cars.json file truncated (all content deleted).\n");
  });
}

// Testing functions
createFolders("testFolder1", "testFolder2");
addCar({ id: 1, model: "Audi", price: 1000 });
addCar({ id: 2, model: "BMW", price: 2000 });
console.log("All cars:", getAllCars());
deleteCarById(1);
console.log("After deletion:", getAllCars());
readCarsStream();
writeCarsStream({ id: 3, model: "Tesla", price: 3000 });
truncateCarsFile();
