import React from 'react';

export function Button({ children, variant = 'primary', icon, className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{icon ? <span className="button-icon" aria-hidden="true">{icon}</span> : null}{children}</button>;
}

export function Panel({ children, className = '', as: Tag = 'section', ...props }) {
	return <Tag className={`glass-panel ${className}`} {...props}>{children}</Tag>;
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Avatar({ player, size = 'md', muted = false }) {
  return <span className={`avatar avatar-${size} ${muted ? 'avatar-muted' : ''}`} style={{ '--avatar-color': player?.color || '#8b7cff' }} aria-hidden="true">{player?.avatar || '🛰️'}</span>;
}

export function Toggle({ label, checked, onChange, hint }) {
  return <label className="toggle-row"><span><strong>{label}</strong>{hint ? <small>{hint}</small> : null}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="toggle-track" aria-hidden="true"><span /></span></label>;
}

export function Stepper({ label, value, min, max, onChange, hint }) {
  return <div className="stepper-row"><span><strong>{label}</strong>{hint ? <small>{hint}</small> : null}</span><div className="stepper"><button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>−</button><b>{value}</b><button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(Math.min(max, value + 1))}>+</button></div></div>;
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.tone || 'info'}`} role="status"><span aria-hidden="true">{toast.tone === 'danger' ? '⚠️' : '✦'}</span><span>{toast.message}</span><button aria-label="Dismiss message" onClick={onClose}>×</button></div>;
}

export function Modal({ title, children, onClose, actions }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div><div className="modal-body">{children}</div>{actions ? <div className="modal-actions">{actions}</div> : null}</div></div>;
}

export function EmptyState({ icon = '✦', title, text, action }) {
  return <div className="empty-state"><div className="empty-icon" aria-hidden="true">{icon}</div><h3>{title}</h3><p>{text}</p>{action}</div>;
}
