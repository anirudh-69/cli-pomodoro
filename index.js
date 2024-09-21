import { intro, outro, text, spinner } from '@clack/prompts';
import { setTimeout } from 'timers/promises';

import playSound from 'play-sound';
import { URL } from 'url';

const sound = playSound();
const soundFile = new URL('./sound/fx-loud-emergency-alarm-236420.mp3', import.meta.url).pathname;

async function main() {
  intro('🍅 Welcome to the Pomodoro Timer CLI');

  const workDuration = await text({
    message: 'Enter work duration in minutes:',
    placeholder: '25',
    validate(value) {
      if (isNaN(value) || value <= 0) return '⚠️ Please enter a valid number';
    }
  });

  const breakDuration = await text({
    message: 'Enter break duration in minutes:',
    placeholder: '5',
    validate(value) {
      if (isNaN(value) || value <= 0) return '⚠️ Please enter a valid number';
    }
  });

  const cycles = await text({
    message: 'Enter number of cycles:',
    placeholder: '4',
    validate(value) {
      if (isNaN(value) || value <= 0) return '⚠️ Please enter a valid number';
    }
  });

  for (let i = 0; i < cycles; i++) {
    console.log(`\nCycle ${i + 1} of ${cycles}`);
    await startTimer(workDuration, 'Work');
    await startTimer(breakDuration, 'Break');
  }

  outro('All pomodoro cycles complete! Goodbye 👋');
}

async function startTimer(duration, type) {
  const durationInMs = duration * 60 * 1000;
  const endTime = Date.now() + durationInMs;
  const timerSpinner = spinner();
  timerSpinner.start(`${type} timer started for ${duration} minutes...`);

  while (Date.now() < endTime) {
    const remainingTime = Math.max(0, endTime - Date.now());
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    timerSpinner.message(`${type} timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} remaining`);
    await setTimeout(1000);
  }
  sound.play(soundFile, (err) => {
    if (err) {
      console.error('/nError playing sound:', err);
    }
  });
  timerSpinner.stop(`${type} timer ended. Time for ${type === 'Work' ? 'a break' : 'work'}!`);
  await setTimeout(5000);
}

main().catch(console.error);