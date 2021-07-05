const currentTime = function loadTime(systemData) {
  time.init({
    refresh: 5000,
    twentyfour: systemData.isTwentyFourHourTimeEnabled,
    callback: function (time) {
      document.querySelector("#time").innerHTML = `Logged in as ${
        config.username
      }&nbsp&nbsp/&nbsp&nbsp${time.hour()}:${time.minute()}&nbsp${time
        .ampm()
        .toUpperCase()}`;
    },
  });
};

const weatherInfo = function loadWeather(weatherData) {
  const weathericons = [
    "&#xf056;",
    "&#xf00e;",
    "&#xf073;",
    "&#xf01e;",
    "&#xf01e;",
    "&#xf017;",
    "&#xf017;",
    "&#xf017;",
    "&#xf015;",
    "&#xf01a;",
    "&#xf015;",
    "&#xf01a;",
    "&#xf01a;",
    "&#xf01b;",
    "&#xf00a;",
    "&#xf064;",
    "&#xf01b;",
    "&#xf015;",
    "&#xf017;",
    "&#xf063;",
    "&#xf014;",
    "&#xf021;",
    "&#xf062;",
    "&#xf050;",
    "&#xf050;",
    "&#xf076;",
    "&#xf013;",
    "&#xf031;",
    "&#xf002;",
    "&#xf031;",
    "&#xf002;",
    "&#xf02e;",
    "&#xf00d;",
    "&#xf083;",
    "&#xf00c;",
    "&#xf017;",
    "&#xf072;",
    "&#xf00e;",
    "&#xf00e;",
    "&#xf00e;",
    "&#xf01a;",
    "&#xf064;",
    "&#xf01b;",
    "&#xf064;",
    "&#xf00c;",
    "&#xf00e;",
    "&#xf01b;",
    "&#xf00e;",
    "&#xf077;",
  ];
  document.querySelector("#weather").innerHTML = `${
    weathericons[weatherData.now.condition.code]
  }&nbsp&nbsp${weatherData.now.temperature.current}&deg${
    weatherData.units.temperature
  }`;
};

const musicButtons = function setMusicButtons(musicData) {
  const paused = document.querySelector(".paused");
  if (!musicData.isPlaying) {
    paused.setAttribute("fill-rule", "");
    paused.setAttribute("clip-rule", "");
    paused.setAttribute(
      "d",
      "M14.671 10.0509C16.443 9.06313 16.443 6.93687 14.671 5.94915L4.78777 0.439984C2.75822 -0.691334 3.37338e-07 0.490162 2.29776e-07 2.49084V13.5092C1.22213e-07 15.5098 2.75822 16.6913 4.78777 15.56L14.671 10.0509Z"
    );
    return;
  }
  paused.setAttribute("fill-rule", "evenodd");
  paused.setAttribute("clip-rule", "evenodd");
  paused.setAttribute(
    "d",
    "M3 0C4.65685 0 6 1.34315 6 3V13C6 14.6569 4.65685 16 3 16C1.34315 16 0 14.6569 0 13V3C0 1.34315 1.34315 0 3 0ZM13 0C14.6569 0 16 1.34315 16 3V13C16 14.6569 14.6569 16 13 16C11.3431 16 10 14.6569 10 13V3C10 1.34315 11.3431 0 13 0Z"
  );
  return;
};

const musicCover = function applyMusicArtwork(musicData) {
  let artwork = document.querySelector(".music__artwork");
  if (!musicData.nowPlaying.artwork)
    return (artwork.style.backgroundImage = `url(./assets/media/noartwork.png)`);
  return (artwork.style.backgroundImage = `url(${musicData.nowPlaying.artwork})`);
};

const musicInfo = function setMusicDetails(arr1, arr2) {
  for (let index = 0; index < arr1.length; index++) {
    arr1[index].innerHTML = arr2[index];
  }
};

const musicDetails = function applyMusicDetails(musicData) {
  let music_details = document.querySelectorAll(".music__details");
  const dp = [
    `${musicData.nowPlaying.artist} - ${musicData.nowPlaying.title}`,
    musicData.nowPlaying.title,
    musicData.nowPlaying.artist,
    musicData.nowPlaying.album,
  ];
  const ds = [
    "No media playing",
    "No media",
    "No artist",
    "Press play to start tunes",
  ];
  if (!musicData.isStopped) return musicInfo(music_details, dp);
  return musicInfo(music_details, ds);
};

const musicStatus = function loadMusicStatus(musicData) {
  musicCover(musicData);
  musicDetails(musicData);
  musicButtons(musicData);
};

const typeface = function setTypeface() {
  if (config.isSystemFontEnabled) {
    document.body.style.setProperty("font-weight", 500);
    document.body.style.setProperty(
      "font-family",
      `
      -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`
    );
    document
      .querySelector("#weather")
      .style.setProperty(
        "font-family",
        `"weather", -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`
      );
  }
};

const settings = function applyConfiguration() {
  typeface();
};

const widgetEvents = function addWidgetEvents(e) {
  if (!e.target.closest("button") && !e.target.closest(".music__artwork"))
    return;
  const music = document.querySelector(".music");
  if (e.target.closest("#collapsed"))
    return music.classList.toggle("music--visible");
  if (e.target.closest(".music__macos"))
    return music.classList.toggle("music--visible");
  if (e.target.closest(".music__artwork"))
    return api.apps.launchApplication(
      api.media.nowPlayingApplication.identifier
    );
  if (e.target.closest("#pause")) return api.media.togglePlayPause();
  if (e.target.closest("#prev")) return api.media.previousTrack();
  if (e.target.closest("#next")) return api.media.nextTrack();
};

const perform = function widgetActions() {
  api.system.observeData(function (systemData) {
    currentTime(systemData);
  });
  api.weather.observeData(function (weatherData) {
    weatherInfo(weatherData);
  });
  api.media.observeData(function (musicData) {
    musicStatus(musicData);
  });
  settings();
};

document.addEventListener("DOMContentLoaded", perform);
document.body.addEventListener("touchend", widgetEvents);
