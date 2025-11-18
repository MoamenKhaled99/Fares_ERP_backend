import {addIrons, fetchAllIrons, getIronByIdService, updateIronService, deleteIronService} from "../service/irons.service.js";
import { validateIron, validateIronId, validateIronUpdate } from "./irons.validation.js";

async function addIronsController(req, res) {
    const ironsData = req.body;
    validateIron(ironsData);
    const newIrons = await addIrons(ironsData)
    res.status(201).json(newIrons);
}

async function getAllIronsController(req, res) {
    const irons = await fetchAllIrons();
    res.status(200).json(irons);
}

async function getIronByIdController(req, res) {
    const { id } = req.params;
    validateIronId(id);
    const iron = await getIronByIdService(id);
    res.status(200).json(iron);
}

async function updateIronController(req, res) {
    const { id } = req.params;
    validateIronId(id);
    validateIronUpdate(req.body);
    const iron = await updateIronService(id, req.body);
    res.status(200).json(iron);
}

async function deleteIronController(req, res) {
    const { id } = req.params;
    validateIronId(id);
    await deleteIronService(id);
    res.status(204).send();
}

export { addIronsController, getAllIronsController, getIronByIdController, updateIronController, deleteIronController };