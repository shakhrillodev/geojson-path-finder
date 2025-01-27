<template>
        <div class="map-box">
          <div id="map" style="height: 100vh"></div>
        </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import {onMounted, shallowRef, ref} from 'vue'
import geoJson from '@/assets/network.json'
import L from 'leaflet'
import PathFinder from 'geojson-path-finder'
import * as turf from '@turf/turf'

const pathFinder = new PathFinder(geoJson);
const points  = turf.explode(geoJson)
const pathPolyLine = ref<null | L.Polyline>(null)
const map = shallowRef()

const lat = 57.6925383
const lng = 11.9545316
const zoom = 10


function initialMap() {
  map.value = L.map('map').setView([lat, lng], zoom, {
    animate: true,
  })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value)
  L.geoJSON(geoJson, {
    style:  {color: 'yellow'}
  }).bindPopup(function (layer:any) {
    return layer?.feature.id as string;
  }).addTo(map.value)
}

const addressPoints: Record<string, Record<string, number>> = {
  marker1: {
    lat,
    lng,
  },
  marker2: {
    lat,
    lng,
  },
}

const getPath = ()=>{
  if(pathPolyLine.value){
    pathPolyLine.value.remove()
  }

  const start = turf.point([addressPoints['marker2'].lng, addressPoints['marker2'].lat])
  const finish = turf.point([addressPoints['marker1'].lng, addressPoints['marker1'].lat])
  const startInNetwork = turf.nearestPoint(start, points)
  const endInNetwork = turf.nearestPoint(finish, points)
  const path = pathFinder.findPath(startInNetwork, endInNetwork);
  if(path){
    const coordinates: [number, number][] = path.path.map((coord) => [coord[1], coord[0]]); // Reverse to [lat, lng]
    pathPolyLine.value = L.polyline(coordinates, { color: 'red' })
    pathPolyLine.value.addTo(map.value)
  }
  console.log(path, "Path")
}

function initialMark() {
  Object.keys(addressPoints).forEach((key, index) => {
    const marker = new L.Marker([addressPoints[key].lat, addressPoints[key].lng], {draggable: true,  customId:key }).bindPopup(
        `<strong> TempRail is! </strong> <br> 125 ${index}`,
    )

    marker.on('dragend', (e)=>{
      addressPoints[e.target.options?.customId as string] = {...e.target._latlng}
      getPath()
    })
    getPath()
    map.value.addLayer(marker)
  })
}

onMounted(() => {
  initialMap()
  initialMark()
})
</script>

<style scoped>
  .map-box {
    overflow: hidden;
    width: 100%;
  }
</style>
