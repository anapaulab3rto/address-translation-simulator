import { Address } from '../models/address.interface';
import { PageFrame } from '../models/page-frame.interface';

export const MOCK_HISTORY: Address[] = [
  {

    virtual: '8 (00001000)',
    physical: '8 (00001000)',
    pageNumber: 0,
    offset: 8,
    hit: false,
    timestamp: 1,
  },
  {

    virtual: '20 (00010100)',
    physical: '20 (00010100)',
    pageNumber: 1,
    offset: 4,
    hit: false,
    timestamp: 2,
  },
  {

    virtual: '35 (00100011)',
    physical: '3 (00000011)',
    pageNumber: 2,
    offset: 3,
    hit: false,
    timestamp: 3,
  },
  {

    virtual: '21 (00010101)',
    physical: '21 (00010101)',
    pageNumber: 1,
    offset: 5,
    hit: true,
    timestamp: 4,
  },
  {

    virtual: '52 (00110100)',
    physical: '16 (00010000)',
    pageNumber: 3,
    offset: 4,
    hit: false,
    timestamp: 5,
  },
  {

    virtual: '36 (00100100)',
    physical: '4 (00000100)',
    pageNumber: 2,
    offset: 4,
    hit: true,
    timestamp: 6,
  },
  {

    virtual: '64 (01000000)',
    physical: '0 (00000000)',
    pageNumber: 4,
    offset: 0,
    hit: false,
    timestamp: 7,
  },
  {

    virtual: '36 (00100100)',
    physical: '—',
    pageNumber: 2,
    offset: 4,
    hit: false,
    timestamp: 8,
  },
];

import { Process } from '../models/process.interface';

export const MOCK_PROCESSES: Process[] = [
  {
    pid: 1,
    name: 'P1',
    pageSizeBytes: 16,
    addressSpaceBytes: 64,
    pageTable: [
      { pid: 1, pageNumber: 0, valid: false, offset: "10100" },
      { pid: 1, pageNumber: 2, valid: false, offset: "45" },
    ],
  },
  {
    pid: 2,
    name: 'P2',
    pageSizeBytes: 16,
    addressSpaceBytes: 64,
    pageTable: [
      { pid: 2, pageNumber: 1, valid: false, offset: "7" },
      { pid: 2, pageNumber: 4, frameNumber: "00", valid: true, loadedAt: 7, offset: "28" },
    ],
  },
  {
    pid: 3,
    name: 'P3',
    pageSizeBytes: 16,
    addressSpaceBytes: 64,
    pageTable: [{ pid: 3, pageNumber: 3, frameNumber: "01", valid: true, loadedAt: 5, offset: "63" }],
  },
];

export const MOCK_FRAMES: PageFrame[] = [
  {
    frameNumber: '00',
    pid: 2,
    pageNumber: "110",
    loadedAt: 7,
  },
  {
    frameNumber: "01",
    pid: 3,
    pageNumber: "011",
    loadedAt: 5,
  },
  {
    frameNumber: "10",
    pid: undefined,
    pageNumber: undefined,
  },
  {
    frameNumber: "11",
    pid: undefined,
    pageNumber: undefined,
  },
];
