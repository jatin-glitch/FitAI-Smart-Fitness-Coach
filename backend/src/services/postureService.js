/**
 * AI Posture Analysis Service
 * Provides posture feedback based on body keypoint data.
 * In production, this would integrate with TensorFlow.js/MediaPipe on-device.
 * The backend processes keypoints sent from the mobile client.
 */

class PostureService {
  // Keypoint indices (MediaPipe Pose format)
  static KEYPOINTS = {
    NOSE: 0,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
  };

  analyzePosture(keypoints, exerciseType = 'standing') {
    if (!keypoints || keypoints.length < 29) {
      return { score: 0, feedback: [], isValid: false };
    }

    const feedback = [];
    let score = 100;

    switch (exerciseType) {
      case 'squat':
        return this.analyzeSquat(keypoints);
      case 'plank':
        return this.analyzePlank(keypoints);
      case 'pushup':
        return this.analyzePushup(keypoints);
      default:
        return this.analyzeStandingPosture(keypoints);
    }
  }

  analyzeStandingPosture(keypoints) {
    const feedback = [];
    let score = 100;

    const leftShoulder = keypoints[PostureService.KEYPOINTS.LEFT_SHOULDER];
    const rightShoulder = keypoints[PostureService.KEYPOINTS.RIGHT_SHOULDER];
    const leftHip = keypoints[PostureService.KEYPOINTS.LEFT_HIP];
    const rightHip = keypoints[PostureService.KEYPOINTS.RIGHT_HIP];
    const nose = keypoints[PostureService.KEYPOINTS.NOSE];

    // Check shoulder alignment
    if (leftShoulder && rightShoulder) {
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiff > 0.05) {
        score -= 15;
        feedback.push({
          type: 'warning',
          message: 'Your shoulders are uneven. Try to level them.',
          bodyPart: 'shoulders',
          severity: shoulderDiff > 0.1 ? 'high' : 'medium',
        });
      }
    }

    // Check hip alignment
    if (leftHip && rightHip) {
      const hipDiff = Math.abs(leftHip.y - rightHip.y);
      if (hipDiff > 0.05) {
        score -= 10;
        feedback.push({
          type: 'warning',
          message: 'Your hips are tilted. Stand evenly on both feet.',
          bodyPart: 'hips',
          severity: 'medium',
        });
      }
    }

    // Check head position (forward head)
    if (nose && leftShoulder && rightShoulder) {
      const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
      const headOffset = Math.abs(nose.x - shoulderMidX);
      if (headOffset > 0.08) {
        score -= 20;
        feedback.push({
          type: 'correction',
          message: 'Straighten your back. Your head is too far forward.',
          bodyPart: 'head',
          severity: 'high',
        });
      }
    }

    if (feedback.length === 0) {
      feedback.push({
        type: 'success',
        message: 'Great posture! Keep it up.',
        bodyPart: 'general',
        severity: 'none',
      });
    }

    return { score: Math.max(0, score), feedback, isValid: true };
  }

  analyzeSquat(keypoints) {
    const feedback = [];
    let score = 100;

    const leftKnee = keypoints[PostureService.KEYPOINTS.LEFT_KNEE];
    const rightKnee = keypoints[PostureService.KEYPOINTS.RIGHT_KNEE];
    const leftAnkle = keypoints[PostureService.KEYPOINTS.LEFT_ANKLE];
    const rightAnkle = keypoints[PostureService.KEYPOINTS.RIGHT_ANKLE];
    const leftHip = keypoints[PostureService.KEYPOINTS.LEFT_HIP];
    const rightHip = keypoints[PostureService.KEYPOINTS.RIGHT_HIP];

    // Check knee alignment (knees shouldn't go past toes)
    if (leftKnee && leftAnkle) {
      if (leftKnee.x > leftAnkle.x + 0.05) {
        score -= 20;
        feedback.push({
          type: 'correction',
          message: "Don't let your knees go past your toes.",
          bodyPart: 'knees',
          severity: 'high',
        });
      }
    }

    // Check depth
    if (leftHip && leftKnee) {
      const hipKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      if (hipKneeAngle > 120) {
        feedback.push({
          type: 'info',
          message: 'Try to go deeper for a full range of motion.',
          bodyPart: 'legs',
          severity: 'low',
        });
      }
    }

    if (feedback.length === 0) {
      feedback.push({
        type: 'success',
        message: 'Perfect squat form!',
        bodyPart: 'general',
        severity: 'none',
      });
    }

    return { score: Math.max(0, score), feedback, isValid: true };
  }

  analyzePlank(keypoints) {
    const feedback = [];
    let score = 100;

    const leftShoulder = keypoints[PostureService.KEYPOINTS.LEFT_SHOULDER];
    const leftHip = keypoints[PostureService.KEYPOINTS.LEFT_HIP];
    const leftAnkle = keypoints[PostureService.KEYPOINTS.LEFT_ANKLE];

    if (leftShoulder && leftHip && leftAnkle) {
      const bodyAngle = this.calculateAngle(leftShoulder, leftHip, leftAnkle);
      if (bodyAngle < 160) {
        score -= 25;
        feedback.push({
          type: 'correction',
          message: 'Keep your body in a straight line. Your hips are sagging.',
          bodyPart: 'core',
          severity: 'high',
        });
      } else if (bodyAngle > 190) {
        score -= 20;
        feedback.push({
          type: 'correction',
          message: 'Lower your hips slightly. Your body is piked.',
          bodyPart: 'core',
          severity: 'medium',
        });
      }
    }

    if (feedback.length === 0) {
      feedback.push({
        type: 'success',
        message: 'Excellent plank form! Hold steady.',
        bodyPart: 'general',
        severity: 'none',
      });
    }

    return { score: Math.max(0, score), feedback, isValid: true };
  }

  analyzePushup(keypoints) {
    const feedback = [];
    let score = 100;

    const leftShoulder = keypoints[PostureService.KEYPOINTS.LEFT_SHOULDER];
    const leftElbow = keypoints[PostureService.KEYPOINTS.LEFT_ELBOW];
    const leftWrist = keypoints[PostureService.KEYPOINTS.LEFT_WRIST];
    const leftHip = keypoints[PostureService.KEYPOINTS.LEFT_HIP];

    // Check elbow angle
    if (leftShoulder && leftElbow && leftWrist) {
      const elbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      if (elbowAngle > 160) {
        feedback.push({
          type: 'info',
          message: 'Lower your body more for a full push-up.',
          bodyPart: 'arms',
          severity: 'medium',
        });
      }
    }

    // Check body alignment
    if (leftShoulder && leftHip) {
      const leftAnkle = keypoints[PostureService.KEYPOINTS.LEFT_ANKLE];
      if (leftAnkle) {
        const bodyAngle = this.calculateAngle(leftShoulder, leftHip, leftAnkle);
        if (bodyAngle < 155) {
          score -= 20;
          feedback.push({
            type: 'correction',
            message: 'Keep your core tight. Your hips are dropping.',
            bodyPart: 'core',
            severity: 'high',
          });
        }
      }
    }

    if (feedback.length === 0) {
      feedback.push({
        type: 'success',
        message: 'Great push-up form!',
        bodyPart: 'general',
        severity: 'none',
      });
    }

    return { score: Math.max(0, score), feedback, isValid: true };
  }

  calculateAngle(pointA, pointB, pointC) {
    if (!pointA || !pointB || !pointC) return 180;
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x)
      - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let degrees = Math.abs((radians * 180) / Math.PI);
    if (degrees > 180) degrees = 360 - degrees;
    return degrees;
  }
}

module.exports = new PostureService();
