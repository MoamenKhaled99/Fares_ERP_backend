import { addWires, fetchAllWires, getWireByIdService, updateWireService, deleteWireService } from "../service/wires.service.js";
import { validateWire, validateWireId, validateWireUpdate } from "./wires.validation.js";

async function addWiresController(req, res) { 
    const wiresData = req.body;
    validateWire(wiresData);
    const newWires = await addWires(wiresData)
    res.status(201).json(newWires);
}

async function getAllWiresController(req, res) {
    const wires = await fetchAllWires();
    res.status(200).json(wires);
}

async function getWireByIdController(req, res) {
    const { id } = req.params;
    validateWireId(id);
    const wire = await getWireByIdService(id);
    res.status(200).json(wire);
}

async function updateWireController(req, res) {
    const { id } = req.params;
    validateWireId(id);
    validateWireUpdate(req.body);
    const wire = await updateWireService(id, req.body);
    res.status(200).json(wire);
}

async function deleteWireController(req, res) {
    const { id } = req.params;
    validateWireId(id);
    await deleteWireService(id);
    res.status(204).send();
}

export { addWiresController, getAllWiresController, getWireByIdController, updateWireController, deleteWireController };