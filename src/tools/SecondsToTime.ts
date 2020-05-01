export default function(time?: number | string) {
  if (!time) return;
  time = parseFloat(time.toString());
  time = Math.round(time);
  let hours: any = Math.floor(time / 3600);
  let minutes: any = Math.floor((time % 3600) / 60);
  let seconds: any = time % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return hours + ":" + minutes + ":" + seconds; // 2:41:30
}
