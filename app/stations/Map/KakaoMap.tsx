import React from 'react';
import { CustomOverlayMap, Map, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import { IUserLocation } from '..';
import { IStationData } from '@app/types/stations/stations';
import Marker from './Marker';
import { useStationsStore } from '@app/store/stations';

const LoadErrorMap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
);

interface IProps {
  userLocation: IUserLocation;
  handleCenterLocation: ({ lat, lng }: { lat: number; lng: number }) => void;
}

const KakaoMap = ({ userLocation }: IProps) => {
  const { stationsList } = useStationsStore((state) => state.filteredData);
  const mapCenterPotition = { lat: userLocation.lat, lng: userLocation.lng };

  const targetMarkers =
    stationsList.map((sItem: IStationData) => <Marker key={sItem['충전소_관리번호']} stationData={sItem} />) ?? [];

  return (
    (
      <Map level={6} center={mapCenterPotition} style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}>
        {/* 지도/스카이뷰 제어 Control */}
        <MapTypeControl position="TOPRIGHT" />
        {/* 지도 확대/축소를 제어 Control */}
        <ZoomControl position="BOTTOMRIGHT" />
        <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
          // 커스텀 오버레이가 표시될 위치입니다
          position={{
            lat: 35.5549546,
            lng: 129.2801509,
          }}
        >
          {/* 커스텀 오버레이에 표시할 내용입니다 */}
          <div
            className="label"
            style={{
              backgroundColor: '#f01468',
              borderRadius: '4px',
              border: '1px dashed black',
              padding: '.2rem .2rem',
              fontSize: '.6rem',
              color: '#FFF',
            }}
          >
            <span className="left"></span>
            <span className="center">나의 위치</span>
            <span className="right"></span>
          </div>
        </CustomOverlayMap>
        {...targetMarkers}
      </Map>
    ) ?? <LoadErrorMap />
  );
};

export default KakaoMap;
