import React, { KeyboardEvent, ReactNode } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableRow,
  TableCell,
  TableColumn,
  TableBody,
  TableHeader,
} from '@nextui-org/react';
import { useStationsStore } from '@app/store/stations';
import { IStationsState } from '@app/types/store/stations';
import { IModalDataKey, IWorkTimeDaily } from '@app/types/stations/modal';
import { getWorkTimeDaily } from './Handlers';

const dataKey: IModalDataKey[] = [
  '지번주소',
  '도로명주소',
  '전화번호',
  '판매가격',
  '충전가능차량',
  '충전소_관리번호',
  '충전소_유형명',
  '충전소_유형코드',
  '요일별 영업시간',
  '휴식_시간',
];

const InfoModal = (): ReactNode => {
  const {
    changeModal,
    modal: { isOpen, data },
  } = useStationsStore((state: IStationsState) => state);

  /** Modal UI 종료 핸들러 함수 */
  const closeModal = (): void => {
    changeModal({ isOpen: false });
  };

  /** esc 키에 Modal Close 이벤트 트리거 연결 */
  const handleESCKey = (e: KeyboardEvent<HTMLElement>): void => {
    // 🔎 KeyboardEvent codes Ref : (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
    if (e.code === 'Escape') {
      closeModal();
    }
  };

  const workTimeDaily: IWorkTimeDaily[] = getWorkTimeDaily(data);

  const tableItems =
    data &&
    dataKey.map((key: IModalDataKey) => {
      if (key === '판매가격') return { title: key, content: data[key] ? `${data[key].toLocaleString()} 원` : '' };

      if (key === '요일별 영업시간')
        return {
          title: key,
          content: (
            <Table removeWrapper aria-label="Example static collection table">
              <TableHeader>
                {workTimeDaily.map((item: IWorkTimeDaily, index: number) => (
                  <TableColumn key={index}>{item?.week}</TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                <TableRow>
                  {workTimeDaily.map((item: { week: string; start: string; end: string }, index: number) => (
                    <TableCell key={index}>
                      <strong className="text-small">{`${item?.start} ~ ${item?.end} `}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          ),
        };

      return { title: key.replace('_', ' '), content: data[key] ?? '' };
    });

  return (
    data && (
      <Modal
        classNames={{
          closeButton: 'flex justify-center items-center w-[2em] p-[.2rem] h-[2em] text-2xl',
        }}
        isOpen={isOpen}
        size="5xl"
        onKeyUp={(e) => {
          handleESCKey(e);
        }}
        isDismissable={true}
        placement="center"
        onClose={() => {
          closeModal();
        }}
        motionProps={{
          variants: {
            enter: {
              y: 10,
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -50,
              opacity: 0,
              transition: {
                duration: 0.5,
                ease: 'easeIn',
              },
            },
          },
        }}
      >
        <ModalContent className="text-black">
          <ModalHeader className="flex flex-col gap-1 text-2xl">{data['충전소_명']}</ModalHeader>
          <ModalBody>
            <Table
              isStriped
              hideHeader
              classNames={{
                wrapper: 'max-h-[100%]',
                td: 'h-[4em]',
              }}
            >
              <TableHeader>
                <TableColumn>title</TableColumn>
                <TableColumn>content</TableColumn>
              </TableHeader>
              <TableBody>
                {tableItems.map((item: { title: string; content: string | ReactNode }, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell width={'15%'}>
                      <strong className="text-medium">{item?.title}</strong>
                    </TableCell>
                    <TableCell>{item?.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="ghost" size="lg" onPress={closeModal}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  );
};

export default InfoModal;
