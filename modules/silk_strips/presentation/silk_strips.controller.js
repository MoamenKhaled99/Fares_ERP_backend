import { addSilkStrips, fetchAllSilkStrips, getSilkStripByIdService, updateSilkStripService, deleteSilkStripService } from "../service/silk_strips.service.js";
import { validateSilkStrip, validateSilkStripId, validateSilkStripUpdate } from "./silk_strips.validation.js";

async function addSilkStripsController(req, res) {
    const silkStripsData = req.body;
    validateSilkStrip(silkStripsData);
    const newSilkStrips = await addSilkStrips(silkStripsData)
    res.status(201).json(newSilkStrips);
}

async function getAllSilkStripsController(req, res) {
    const silkStrips = await fetchAllSilkStrips();
    res.status(200).json(silkStrips);
}

async function getSilkStripByIdController(req, res) {
    const { id } = req.params;
    validateSilkStripId(id);
    const silkStrip = await getSilkStripByIdService(id);
    res.status(200).json(silkStrip);
}

async function updateSilkStripController(req, res) {
    const { id } = req.params;
    validateSilkStripId(id);
    validateSilkStripUpdate(req.body);
    const silkStrip = await updateSilkStripService(id, req.body);
    res.status(200).json(silkStrip);
}

async function deleteSilkStripController(req, res) {
    const { id } = req.params;
    validateSilkStripId(id);
    await deleteSilkStripService(id);
    res.status(204).send();
}

export { addSilkStripsController, getAllSilkStripsController, getSilkStripByIdController, updateSilkStripController, deleteSilkStripController };