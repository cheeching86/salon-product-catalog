import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineIndicator() {
  const online = useOnlineStatus()
  return (
    <span className={`status-pill ${online ? '' : 'status-pill--offline'}`}>
      <span className="status-pill__dot" />
      {online ? 'Online' : 'Offline'}
    </span>
  )
}
