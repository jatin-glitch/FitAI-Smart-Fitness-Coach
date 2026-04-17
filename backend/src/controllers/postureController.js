const postureService = require('../services/postureService');

const analyzePosture = async (req, res, next) => {
  try {
    const { keypoints, exerciseType } = req.body;
    if (!keypoints) {
      return res.status(400).json({ error: 'Keypoints data is required.' });
    }
    const result = postureService.analyzePosture(keypoints, exerciseType);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzePosture };
