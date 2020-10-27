import {ByPriority, ControlLogEvent, LogEvent, LogLevel, ReloadSettingsStatus, Stats} from '../../types';
import {RawStatsResponse, ReloadSettingsResponse} from './response';
import {RawControlLogEvent, RawLogEvent} from './event';

function toByPriority(raw: RawStatsResponse['queues']): ByPriority {
  return {
    critical: parseInt(raw.critical),
    high: parseInt(raw.high),
    medium: parseInt(raw.medium),
    low: parseInt(raw.low)
  };
}

export function convertStats(response: RawStatsResponse): Stats {
  const workersByPriority = toByPriority(response.workers.active);
  const queuesByPriority = toByPriority(response.queues);

  return {
    runningSince: new Date(response.uptime.since),
    workers: {
      total: parseInt(response.workers.total),
      running: Object.values(workersByPriority).reduce((a, b) => a + b),
      idle: parseInt(response.workers.idle),
      activeByPriority: workersByPriority
    },
    queues: Object.values(queuesByPriority).reduce((a, b) => a + b),
    queuesByPriority,
    ikeSas: parseInt(response.ikesas.total),
    ikeSasHalfOpen: parseInt(response.ikesas['half-open']),
    memory: {
      nomMappedSpace: parseInt(response.mallinfo.sbrk),
      mappedSpace: parseInt(response.mallinfo.mmap),
      used: parseInt(response.mallinfo.used),
      free: parseInt(response.mallinfo.free)
    }
  };
}

export function convertReloadSettings(response: ReloadSettingsResponse): ReloadSettingsStatus {
  const success = response.success === 'yes';
  if (response.errmsg) {
    return {
      success,
      error: response.errmsg
    };
  } else {
    return {success};
  }
}

export function convertControlLog(raw: RawControlLogEvent): ControlLogEvent {
  const event: ControlLogEvent = {
    group: raw.group,
    level: parseInt(raw.level) as LogLevel,
    message: raw.msg
  };

  if (raw['ikesa-name']) {
    event.ikeSa = {
      name: raw['ikesa-name'],
      id: raw['ikesa-uniqued']
    };
  }

  return event;
}

export function convertLog(raw: RawLogEvent): LogEvent {
  return {
    ...convertControlLog(raw),
    thread: parseInt(raw.thread)
  };
}
