'use client';

import React, { useEffect, useState } from 'react';
// import Search from './Search';
// import TableList from './TableList';
import dynamic from 'next/dynamic';
import KakaoMap from './Map/KakaoMap';
import { IApiResponse } from '@app/types/stations/api';
import { useStationsStore } from '@app/store/stations';
import { IStationData } from '@app/types/stations/stations';
import { filteredByStationName, filteredByStreetNumberAddress } from './Handlers';
import { ScrollShadow } from '@nextui-org/react';
import TableHeader from './Table/Header';
const Search = dynamic(() => import('./Search'), { ssr: false });
const TableList = dynamic(() => import('./Table'), { ssr: false });

type ScrollShadowVisibility = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'both' | 'none';

interface IProps {
  apiResponse: IApiResponse;
}

export interface IUserLocation {
  lat: number;
  lng: number;
}

const Stations = ({ apiResponse }: IProps) => {
  const { initialData, changeInitialStation, changeFilteredStation } = useStationsStore((state) => state);
  const [userLocation, setUserLocation] = useState<IUserLocation>({
    lat: 35.5549546,
    lng: 129.2801509,
  });

  // 💡 일단 default 로 지번 기준으로 검색 (추후 충전소명/주소명 옵션 필터 구현 필요 ❗️)
  const handleSearch = (searchText: string): void => {
    // 1. 필터링하기
    const filteredStations = initialData?.stationsList.filter((station: IStationData) => {
      const isMatchedAddress = filteredByStreetNumberAddress({ station, searchText });
      return isMatchedAddress;
    });

    const filteredTotalCount = filteredStations.length;
    // 2. state update 하기
    changeFilteredStation({
      data: filteredStations,
      totalCount: filteredTotalCount,
    });
  };

  useEffect(() => {
    // 충전소 데이터 리스트 초기화
    const initStationsData = (apiResponse: IApiResponse) => {
      changeInitialStation(apiResponse);
      changeFilteredStation(apiResponse);
    };
    initStationsData(apiResponse);

    if ('geolocation' in navigator) {
      /* 위치정보 사용 가능 */
      navigator.geolocation.getCurrentPosition((success) => {
        const { coords } = success;
        setUserLocation({ lat: coords?.latitude, lng: coords?.longitude });
      });
    } else {
      alert('사용자의 위치 정보를 불러올 수 없습니다.');
      /* 위치정보 사용 불가능 */
    }
  }, [apiResponse, changeFilteredStation, changeInitialStation]);

  return (
    <div key="1" className="flex flex-col h-full w-full">
      {/* <header className="flex items-center justify-between p-4 bg-white border-b-2">
        <div className="flex items-center gap-4">
          <MapIcon className="w-6 h-6" />
          <h1 className="text-lg font-semibold">Locations Map</h1>
        </div>
      </header> */}
      <main className="flex-grow p-4">
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-3 relative">
            <KakaoMap userLocation={userLocation} />
          </div>
          <aside className="col-span-2 overflow-y-hidden">
            <Search onSearch={handleSearch} />
            <TableHeader />
            <ScrollShadow hideScrollBar size={130} offset={10} className="h-[100%] border-red-500 border-1">
              <TableList />
            </ScrollShadow>
          </aside>
        </div>
      </main>
    </div>
  );
};

// function MapIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
//       <line x1="9" x2="9" y1="3" y2="18" />
//       <line x1="15" x2="15" y1="6" y2="21" />
//     </svg>
//   );
// }

export default Stations;
