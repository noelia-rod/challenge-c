const { validationResult } = require('express-validator');
const { success } = require('../helpers/apiResponse');
const AreaRepository = require('../../infrastructure/repositories/AreaRepository');
const GetAreasUseCase = require('../../application/usecases/GetAreasUseCase');

const areaRepository = new AreaRepository();
const getAreasUseCase = new GetAreasUseCase(areaRepository);

const getAreas = async (_req, res, next) => {
  try {
    const areas = await getAreasUseCase.execute();
    success(res, areas);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAreas };
