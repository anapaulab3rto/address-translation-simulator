import { Address } from '../models/address.interface';
import { PageFrame } from '../models/page-frame.interface';

export const MOCK_HISTORY: Address[] = [
  {
    pid: 1,
    virtual: '8 (00001000)',
    physical: '8 (00001000)',
    pageNumber: 0,
    offset: 8,
    hit: false,
    timestamp: 1,
  },
  {
    pid: 2,
    virtual: '20 (00010100)',
    physical: '20 (00010100)',
    pageNumber: 1,
    offset: 4,
    hit: false,
    timestamp: 2,
  },
  {
    pid: 1,
    virtual: '35 (00100011)',
    physical: '3 (00000011)',
    pageNumber: 2,
    offset: 3,
    hit: false,
    timestamp: 3,
  },
  {
    pid: 2,
    virtual: '21 (00010101)',
    physical: '21 (00010101)',
    pageNumber: 1,
    offset: 5,
    hit: true,
    timestamp: 4,
  },
  {
    pid: 3,
    virtual: '52 (00110100)',
    physical: '16 (00010000)',
    pageNumber: 3,
    offset: 4,
    hit: false,
    timestamp: 5,
  },
  {
    pid: 1,
    virtual: '36 (00100100)',
    physical: '4 (00000100)',
    pageNumber: 2,
    offset: 4,
    hit: true,
    timestamp: 6,
  },
  {
    pid: 2,
    virtual: '64 (01000000)',
    physical: '0 (00000000)',
    pageNumber: 4,
    offset: 0,
    hit: false,
    timestamp: 7,
  },
  {
    pid: 1,
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
      { pid: 1, pageNumber: 0, valid: false, offset: 12 },
      { pid: 1, pageNumber: 2, valid: false, offset: 45 },
    ],
  },
  {
    pid: 2,
    name: 'P2',
    pageSizeBytes: 16,
    addressSpaceBytes: 64,
    pageTable: [
      { pid: 2, pageNumber: 1, valid: false, offset: 7 },
      { pid: 2, pageNumber: 4, frameNumber: 0, valid: true, loadedAt: 7, offset: 28 },
    ],
  },
  {
    pid: 3,
    name: 'P3',
    pageSizeBytes: 16,
    addressSpaceBytes: 64,
    pageTable: [{ pid: 3, pageNumber: 3, frameNumber: 1, valid: true, loadedAt: 5, offset: 63 }],
  },
];

export const MOCK_FRAMES: PageFrame[] = [
  {
    frameNumber: 0,
    pid: 2,
    pageNumber: 4,
    loadedAt: 7,
  },
  {
    frameNumber: 1,
    pid: 3,
    pageNumber: 3,
    loadedAt: 5,
  },
  {
    frameNumber: 2,
    pid: undefined,
    pageNumber: undefined,
  },
  {
    frameNumber: 3,
    pid: undefined,
    pageNumber: undefined,
  },
];
