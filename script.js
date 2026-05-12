const map = L.map("map", {
  zoomControl: false,
  attributionControl: true,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  tap: false,
  touchZoom: false,
  preferCanvas: false,
});
const NEW_ZEALAND_BOUNDS = L.latLngBounds(
  [-47.35, 166.0],
  [-33.9, 178.8],
);
map.setMaxBounds(NEW_ZEALAND_BOUNDS.pad(0.08));

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);
map.fitBounds(NEW_ZEALAND_BOUNDS, { padding: [4, 4] });

const trailStyle = {
  color: "#c28a16",
  weight: 5,
  opacity: 0.95,
  lineCap: "round",
  lineJoin: "round",
  className: "trail-line",
};

const landmarks = [
  { text: "Shoes on in the Northland forests", page: "Northland Region", point: [-35.25, 173.45], label: [-34.75, 171.45], align: "right" },
  { text: "Ninety Mile Beach", page: "Ninety Mile Beach, New Zealand", point: [-34.95, 173.05], label: [-34.18, 174.65], align: "left" },
  { text: "Auckland volcanoes", page: "Auckland volcanic field", point: [-36.85, 174.76], label: [-36.28, 176.72], align: "left" },
  { text: "Famous Pirongia mud", page: "Mount Pirongia", point: [-37.98, 175.11], label: [-37.76, 177.12], align: "left" },
  { text: "Tongariro", page: "Tongariro National Park", point: [-39.17, 175.58], label: [-39.18, 177.05], align: "left" },
  { text: "Canoe the Whanganui River", page: "Whanganui River", point: [-39.92, 175.04], label: [-38.95, 171.55], align: "right" },
  { text: "Tararuas: wild and windy", page: "Tararua Range", point: [-40.85, 175.36], label: [-40.66, 177.08], align: "left" },
  { text: "Catch the ferry in windy Welly", page: "Wellington Harbour", point: [-41.29, 174.78], label: [-41.65, 176.55], align: "left" },
  { text: "Ship Cove", page: "Ship Cove, New Zealand", point: [-41.1, 174.23], label: [-40.15, 171.65], align: "right" },
  { text: "Beautiful Nelson Lakes", page: "Nelson Lakes National Park", point: [-41.85, 172.82], label: [-41.78, 170.95], align: "right" },
  {
    text: "Richmond Ranges",
    page: "Richmond Range",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Enchanted%20Lookout%20over%20Wairau%20Valley.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Enchanted_Lookout_over_Wairau_Valley.jpg",
    description: "Wairau Valley mountain country beside the Richmond Range section of Te Araroa.",
    point: [-41.55, 173.2],
    label: [-41.25, 171.18],
    align: "right",
  },
  { text: "Arthur's Pass", page: "Arthur's Pass National Park", point: [-42.94, 171.56], label: [-42.75, 173.58], align: "left" },
  { text: "Awesome cycle from Tekapo to Ohau", page: "Lake Tekapo", point: [-44.0, 170.48], label: [-43.62, 172.78], align: "left" },
  {
    text: "Stag Saddle: highest point on TA",
    page: "Stag Saddle",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Te%20Araroa%20logo%20sign.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Te_Araroa_logo_sign.jpg",
    description: "Te Araroa high-country signage near the Lake Tekapo and Two Thumb Range area.",
    point: [-44.5, 170.7],
    label: [-44.12, 168.22],
    align: "right",
  },
  { text: "More mud", page: "Fiordland National Park", point: [-45.25, 168.75], label: [-45.78, 166.7], align: "right" },
  { text: "Bluff finish", page: "Bluff, New Zealand", point: [-46.6, 168.35], label: [-46.15, 170.52], align: "left" },
];

const photoPanel = document.querySelector("#photoPanel");
const photoImage = document.querySelector("#photoImage");
const photoTitle = document.querySelector("#photoTitle");
const photoDescription = document.querySelector("#photoDescription");
const photoLink = document.querySelector("#photoLink");
const closePhoto = document.querySelector("#closePhoto");
const CALLOUT_WIDTH = 900;
const CALLOUT_HEIGHT = 420;
const CALLOUT_CENTER_X = CALLOUT_WIDTH / 2;
const CALLOUT_CENTER_Y = CALLOUT_HEIGHT / 2;
const WAVE_VIEWBOX = { width: 1600, height: 900 };
const landWaveBlockers = document.querySelector("#landWaveBlockers");

const waveLandMasks = [
  [
    [-34.15, 172.55],
    [-34.18, 173.0],
    [-34.75, 173.55],
    [-35.55, 174.28],
    [-36.12, 174.78],
    [-36.65, 175.15],
    [-37.16, 176.02],
    [-37.8, 177.15],
    [-38.58, 178.35],
    [-39.35, 177.45],
    [-39.98, 176.62],
    [-40.55, 176.25],
    [-41.58, 175.3],
    [-41.42, 174.55],
    [-40.72, 174.1],
    [-39.9, 173.72],
    [-39.0, 173.8],
    [-38.28, 174.12],
    [-37.55, 173.95],
    [-36.78, 174.38],
    [-36.02, 174.08],
    [-35.18, 173.62],
  ],
  [
    [-40.48, 173.55],
    [-40.95, 174.35],
    [-41.48, 174.35],
    [-42.02, 173.58],
    [-42.62, 173.38],
    [-43.18, 172.9],
    [-43.86, 171.9],
    [-44.58, 171.1],
    [-45.32, 170.58],
    [-46.05, 169.52],
    [-46.78, 168.32],
    [-46.48, 167.28],
    [-45.82, 166.35],
    [-44.82, 167.08],
    [-44.08, 168.18],
    [-43.36, 169.28],
    [-42.76, 170.42],
    [-42.18, 171.42],
    [-41.62, 172.3],
    [-41.0, 172.65],
  ],
  [
    [-46.65, 167.55],
    [-46.75, 168.5],
    [-47.35, 168.75],
    [-47.48, 167.85],
  ],
];

function markerIcon(className) {
  return L.divIcon({
    className,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

function calloutIcon(landmark, index, offset) {
  const length = Math.hypot(offset.x, offset.y);
  const angle = Math.atan2(offset.y, offset.x) * (180 / Math.PI);
  const labelTransform = landmark.align === "right" ? "translate(-100%, -50%)" : "translate(0, -50%)";

  return L.divIcon({
    className: "landmark-callout",
    iconSize: [CALLOUT_WIDTH, CALLOUT_HEIGHT],
    iconAnchor: [CALLOUT_CENTER_X, CALLOUT_CENTER_Y],
    html: `
      <span
        class="callout-line"
        style="left:${CALLOUT_CENTER_X}px;top:${CALLOUT_CENTER_Y}px;width:${length}px;transform:rotate(${angle}deg)"
      ></span>
      <button
        class="note note-${landmark.align}"
        type="button"
        data-landmark="${index}"
        style="left:${CALLOUT_CENTER_X + offset.x}px;top:${CALLOUT_CENTER_Y + offset.y}px;transform:${labelTransform}"
      >${escapeHtml(landmark.text)}</button>
    `,
  });
}

function landMaskPoint(latLng) {
  const size = map.getSize();
  const point = map.latLngToContainerPoint(latLng);

  return {
    x: (point.x / size.x) * WAVE_VIEWBOX.width,
    y: (point.y / size.y) * WAVE_VIEWBOX.height,
  };
}

function updateWaveLandMask() {
  if (!landWaveBlockers) return;

  landWaveBlockers.innerHTML = "";

  waveLandMasks.forEach((polygon) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const points = polygon.map(landMaskPoint);
    const d = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(" ");

    path.setAttribute("d", `${d} Z`);
    landWaveBlockers.append(path);
  });
}

async function showLandmarkPhoto(landmark) {
  photoPanel.hidden = false;
  photoPanel.classList.add("is-loading");
  photoTitle.textContent = landmark.text;
  photoDescription.textContent = "Loading photo...";
  photoImage.removeAttribute("src");
  photoImage.alt = "";
  photoLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(landmark.page).replaceAll("%20", "_")}`;

  if (landmark.image) {
    photoImage.src = landmark.image;
    photoImage.alt = landmark.text;
    photoTitle.textContent = landmark.text;
    photoDescription.textContent = landmark.description;
    photoLink.href = landmark.source;
    photoPanel.classList.remove("is-loading");
    return;
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(landmark.page)}`,
    );
    if (!response.ok) throw new Error("Photo lookup failed");
    const data = await response.json();
    const image = data.originalimage?.source || data.thumbnail?.source;

    if (image) {
      photoImage.src = image;
      photoImage.alt = data.title || landmark.text;
    }

    photoTitle.textContent = data.title || landmark.text;
    photoDescription.textContent = data.extract || "Photo source from Wikipedia/Wikimedia.";
    photoLink.href = data.content_urls?.desktop?.page || photoLink.href;
  } catch {
    photoImage.src = `https://commons.wikimedia.org/wiki/Special:Redirect/file?wpvalue=${encodeURIComponent(
      landmark.page,
    )}`;
    photoImage.alt = landmark.text;
    photoDescription.textContent = "Open the source link for more photos and context.";
  } finally {
    photoPanel.classList.remove("is-loading");
  }
}

closePhoto.addEventListener("click", () => {
  photoPanel.hidden = true;
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-landmark]");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();
  showLandmarkPhoto(landmarks[Number(button.dataset.landmark)]);
});

function drawTrail() {
  const allSegments = TE_ARAROA_ROUTE;
  const route = L.featureGroup().addTo(map);
  const callouts = L.layerGroup().addTo(map);

  allSegments.forEach((segment) => {
    L.polyline(segment, trailStyle).addTo(route);
  });

  const firstPoint = allSegments[0][0];
  const lastSegment = allSegments[allSegments.length - 1];
  const lastPoint = lastSegment[lastSegment.length - 1];

  L.marker(firstPoint, { icon: markerIcon("start-marker"), title: "Cape Reinga" }).addTo(route);
  L.marker(lastPoint, { icon: markerIcon("end-marker"), title: "Bluff" }).addTo(route);

  landmarks.forEach((landmark, index) => {
    L.circleMarker(landmark.point, {
      radius: 4,
      color: "#5d4a24",
      weight: 2,
      fillColor: "#fff1a8",
      fillOpacity: 1,
      interactive: false,
    }).addTo(route);

  });

  map.fitBounds(route.getBounds(), {
    padding: [8, 18],
    maxZoom: 6,
  });

  function renderCallouts() {
    callouts.clearLayers();

    landmarks.forEach((landmark, index) => {
      const target = map.latLngToContainerPoint(landmark.point);
      const label = map.latLngToContainerPoint(landmark.label);

      L.marker(landmark.point, {
        icon: calloutIcon(landmark, index, {
          x: label.x - target.x,
          y: label.y - target.y,
        }),
        interactive: true,
        keyboard: false,
      }).addTo(callouts);
    });
  }

  renderCallouts();
  updateWaveLandMask();
  map.on("resize", () => {
    map.fitBounds(route.getBounds(), {
      padding: [8, 18],
      maxZoom: 6,
    });
    requestAnimationFrame(renderCallouts);
    requestAnimationFrame(updateWaveLandMask);
  });
}

drawTrail();
