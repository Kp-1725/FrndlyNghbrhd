import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Request } from '@shared/schema';
import { categoryConfig } from '@/lib/utils';

interface LocationMapProps {
  requests: Request[];
  userLocation?: LatLngTuple;
  onMoveEnd?: (center: LatLngTuple) => void;
  height?: string;
  onMarkerClick?: (requestId: number) => void;
  onSelectLocation?: (location: LatLngTuple) => void;
  selectable?: boolean;
  selectedLocation?: LatLngTuple;
}

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return new Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
}

const primaryIcon = createMarkerIcon('blue');
const secondaryIcon = createMarkerIcon('green');
const userIcon = createMarkerIcon('gold');
const selectIcon = createMarkerIcon('red');

function SetViewOnUserLocation({ center }: { center: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function LocationMarker({ onSelectLocation }: { onSelectLocation?: (location: LatLngTuple) => void }) {
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  
  const map = useMapEvents({
    click(e) {
      if (onSelectLocation) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onSelectLocation([lat, lng]);
      }
    },
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return onSelectLocation && position ? (
    <Marker position={position} icon={selectIcon}>
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
}

export function LocationMap({ 
  requests, 
  userLocation = [37.7749, -122.4194], // Default to San Francisco
  onMoveEnd,
  height = "500px",
  onMarkerClick,
  onSelectLocation,
  selectable = false,
  selectedLocation
}: LocationMapProps) {
  const [center, setCenter] = useState<LatLngTuple>(userLocation);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  const handleMoveEnd = useCallback((event: any) => {
    const newCenter = [
      event.target.getCenter().lat,
      event.target.getCenter().lng
    ] as LatLngTuple;
    
    if (onMoveEnd) {
      onMoveEnd(newCenter);
    }
  }, [onMoveEnd]);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      scrollWheelZoom={true}
      style={{ height }}
      className="rounded-xl shadow-md"
      whenReady={e => {
        e.target.on('moveend', handleMoveEnd);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <>
          <SetViewOnUserLocation center={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
          <Circle center={userLocation} radius={500} pathOptions={{ color: '#facc15', fillColor: '#facc15', fillOpacity: 0.2 }} />
        </>
      )}
      
      {requests.map(request => {
        const { lat, lng } = request.location;
        const categoryInfo = categoryConfig[request.category];
        
        return (
          <Marker 
            key={request.id} 
            position={[lat, lng]} 
            icon={primaryIcon}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(request.id);
                }
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{request.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{request.description.substring(0, 100)}...</p>
                <span className={`inline-block px-2 py-1 text-xs ${categoryInfo.bgColor} ${categoryInfo.textColor} rounded-full mt-2`}>
                  {categoryInfo.label}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {selectable && <LocationMarker onSelectLocation={onSelectLocation} />}
      
      {selectedLocation && !selectable && (
        <Marker position={selectedLocation} icon={selectIcon}>
          <Popup>Meeting location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
