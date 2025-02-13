const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const axios = require("axios"); 

const app = express();
const port = 8080;


const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());


const vehicles = [
    { id: 1, plate: "ABC1234", owner: "John Doe", model: "Toyota Camry", color: "White", year: 2020, status: "Active" },
    { id: 2, plate: "XYZ5678", owner: "Jane Smith", model: "Honda Civic", color: "Black", year: 2019, status: "Inactive" },
    { id: 3, plate: "LMN9876", owner: "Robert Brown", model: "Ford Focus", color: "Blue", year: 2021, status: "Active" },
    { id: 4, plate: "PQR4567", owner: "Alice Johnson", model: "Nissan Altima", color: "Gray", year: 2022, status: "Active" },
    { id: 5, plate: "STU8901", owner: "Michael Wilson", model: "Hyundai Sonata", color: "Red", year: 2023, status: "Inactive" },
];


const ApiKey = "YOUR_API_KEY";


async function fetchCarDatas(params) {
    try {
        const apiUrl = "https://api.api-ninjas.com/v1/cars";
        const response = await axios.get(apiUrl, {
            params: params,
            headers: { "X-Api-Key": ApiKey },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching car data from API:", error);
        throw error;
    }
}



app.get("/vehicles", (req, res) => {
    res.json(vehicles);
});


app.get("/vehicles/:plate", (req, res) => {
    const vehicle = vehicles.find(v => v.plate === req.params.plate.toUpperCase());
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ message: "Vehicle not found" });
    }
});


app.post("/vehicles", (req, res) => {
    const newVehicle = req.body;
    vehicles.push(newVehicle);
    res.status(201).json(newVehicle);
});


app.put("/vehicles/:plate", (req, res) => {
    const index = vehicles.findIndex(v => v.plate === req.params.plate.toUpperCase());
    if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...req.body };
        res.json(vehicles[index]);
    } else {
        res.status(404).json({ message: "Vehicle not found" });
    }
});


app.delete("/vehicles/:plate", (req, res) => {
    const index = vehicles.findIndex(v => v.plate === req.params.plate.toUpperCase());
    if (index !== -1) {
        vehicles.splice(index, 1);
        res.json({ message: "Vehicle deleted" });
    } else {
        res.status(404).json({ message: "Vehicle not found" });
    }
});


app.get("/vehicles/status/active", (req, res) => {
    const activeVehicles = vehicles.filter(v => v.status === "Active");
    res.json(activeVehicles);
});


app.get("/vehicles/status/inactive", (req, res) => {
    const inactiveVehicles = vehicles.filter(v => v.status === "Inactive");
    res.json(inactiveVehicles);
});


app.get("/vehicles/owner/:owner", (req, res) => {
    const ownerVehicles = vehicles.filter(v => v.owner.toLowerCase() === req.params.owner.toLowerCase());
    res.json(ownerVehicles);
});


app.get("/vehicles/model/:model", (req, res) => {
    const modelVehicles = vehicles.filter(v => v.model.toLowerCase() === req.params.model.toLowerCase());
    res.json(modelVehicles);
});


app.get("/vehicles/year/:year", (req, res) => {
    const yearVehicles = vehicles.filter(v => parseInt(req.params.year) === v.year);
    res.json(yearVehicles);
});


app.get("/vehicles/color/:color", (req, res) => {
    const colorVehicles = vehicles.filter(v => v.color.toLowerCase() === req.params.color.toLowerCase());
    res.json(colorVehicles);
});


app.get("/external/vehicles/make/:make", async (req, res) => {
    try {
        const make = req.params.make.toLowerCase();
        const carData = await fetchCarDatas({ make: make });
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicle data" });
    }
});


app.get("/external/vehicles/fuel/:fuel_type", async (req, res) => {
    try {
        const fuel_type = req.params.fuel_type.toLowerCase();
        const carData = await fetchCarDatas({ fuel_type: fuel_type });
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicle data" });
    }
});


app.get("/external/vehicles/make/:make/model/:model", async (req, res) => {
    try {
        const make = req.params.make.toLowerCase();
        const model = req.params.model.toLowerCase();
        const carData = await fetchCarDatas({ make: make, model: model });
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicle data" });
    }
});


app.get("/external/vehicles/year/:year/model/:model", async (req, res) => {
    try {
        const year = req.params.year;
        const model = req.params.model.toLowerCase();
        const carData = await fetchCarDatas({ year: year, model: model });
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicle data" });
    }
});


app.get("/external/vehicles/cylinders/:cylinders", async (req, res) => {
    try {
        const cylinders = req.params.cylinders;
        const carData = await fetchCarDatas({ cylinders: cylinders });
        res.json(carData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicle data" });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:8080`);
    console.log(`Swagger docs available at http://localhost:8080/api-docs`);
});
