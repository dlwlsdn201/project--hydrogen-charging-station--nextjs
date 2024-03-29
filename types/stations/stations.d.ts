export interface IStationData {
  [index: string]: any; // 모든 문자열 인덱스를 허용함
  경도: string;
  공휴일_시작: string;
  공휴일_종료: string;
  금요일_시작: string;
  금요일_종료: string;
  도로명주소: string;
  목요일_시작: string;
  목요일_종료: string;
  수요일_시작: string;
  수요일_종료: string;
  순번: number;
  월요일_시작: string;
  월요일_종료: string;
  위도: string;
  이용가능요일: number;
  일요일_시작: string;
  일요일_종료: string;
  전화번호: string;
  지번주소: string;
  충전가능차량: string;
  충전가능차량코드: number;
  충전소_관리번호: string;
  충전소_명: string;
  충전소_유형명: string;
  충전소_유형코드: number;
  충전소유형비고: string;
  토요일_시작: string;
  토요일_종료: string;
  판매가격: number;
  화요일_시작: string;
  화요일_종료: string;
  휴식_시작: string | null;
  휴식_종료: string | null;
}
