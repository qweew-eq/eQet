// src/assets/wavecalc.js

/**
 * Constants (typical seismic velocities in km/s)
 */
export const P_WAVE_SPEED = 6.0; // km/s
export const S_WAVE_SPEED = 3.5; // km/s

/**
 * Calculates the distance between two points using Haversine formula
 * @param {Number} lat1 
 * @param {Number} lon1 
 * @param {Number} lat2 
 * @param {Number} lon2 
 * @returns distance in km
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = x => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates elapsed time in seconds from originTime
 * @param {String|Date} originTime - ISO string or Date object
 * @returns seconds
 */
export function elapsedSeconds(originTime) {
  const now = new Date();
  const origin = new Date(originTime);
  return (now - origin) / 1000; // in seconds
}

/**
 * Calculates current wave radii (in meters) for P and S waves
 * @param {String|Date} originTime 
 * @returns {pRadius: number, sRadius: number} meters
 */
export function waveRadii(originTime) {
  const elapsed = elapsedSeconds(originTime);
  return {
    pRadius: elapsed * P_WAVE_SPEED * 1000, // convert km to meters
    sRadius: elapsed * S_WAVE_SPEED * 1000
  };
}

/**
 * Checks if a station has received the wave yet
 * @param {Object} station - {lat, lon}
 * @param {Object} epicenter - {lat, lon}
 * @param {String|Date} originTime
 * @param {String} type - 'P' or 'S'
 * @returns Boolean
 */
export function hasWaveArrived(station, epicenter, originTime, type = 'S') {
  const distance = haversineDistance(
    station.lat,
    station.lon,
    epicenter.lat,
    epicenter.lon
  ) * 1000; // meters

  const { pRadius, sRadius } = waveRadii(originTime);

  if(type === 'P') return distance <= pRadius;
  return distance <= sRadius;
}

/**
 * Example: returns time left until wave reaches station
 * @param {Object} station - {lat, lon}
 * @param {Object} epicenter - {lat, lon}
 * @param {String|Date} originTime
 * @param {String} type - 'P' or 'S'
 * @returns seconds until arrival (negative if already arrived)
 */
export function timeToArrival(station, epicenter, originTime, type = 'S') {
  const distance = haversineDistance(
    station.lat,
    station.lon,
    epicenter.lat,
    epicenter.lon
  ); // km
  const speed = type === 'P' ? P_WAVE_SPEED : S_WAVE_SPEED;
  const elapsed = elapsedSeconds(originTime);
  return distance / speed - elapsed; // seconds
}
