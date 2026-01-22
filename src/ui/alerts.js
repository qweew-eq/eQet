const sounds = {};

['eq','3upper','warn','cancel','lastupd','upd','tsunamiforecast','tsunamiadvisory','tsunamiwarn','tsunamimajor','drill',
 '1','2','3','4','5-','5+','6-','6+','7','cancelspeak','PLUM'].forEach(name=>{
  sounds[name] = new Audio(`/sounds/${name}.wav`);
});

export function playAlert(eew) {
  if(eew.isAssumption) sounds['PLUM'].play();
  else if(!eew.isFinal) sounds['upd'].play();
  else if(eew.maxIntensity >= 5) sounds['warn'].play();
  else sounds['eq'].play();
}
