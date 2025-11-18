import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import IronRoute from "./modules/irons/presentation/irons.route.js";
import WireRoute from "./modules/wires/presentation/wires.route.js";
import SilkStripRoute from "./modules/silk_strips/presentation/silk_strips.route.js";
import StockRoute from "./modules/stock/presentation/stock.route.js";
import InvoiceRoute from "./modules/invoices/presentation/invoices.route.js";
import DashboardRoute from "./modules/dashboard/presentation/dashboard.route.js";

import globalErrorFilter from "./shared/filters/global_error.filter.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/irons", IronRoute);
app.use("/wires", WireRoute);
app.use("/silk-strips", SilkStripRoute);
app.use("/stock", StockRoute);
app.use("/invoices", InvoiceRoute);
app.use("/dashboard", DashboardRoute);

app.use(globalErrorFilter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});