import {ComponentPropsWithoutRef, FC, ReactNode, useState} from "react"

type Props = {
  children: ReactNode
} & ComponentPropsWithoutRef<"div">

export const PopUp: FC<Props> = ({children, style = {}, ...props}) => {
  const [open, setOpen] = useState<true | null>(true)

  return open && <div {...props} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    cursor: 'pointer'
  }} onClick={() => setOpen(null)}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
          <div style={{
            background: '#fff',
            display: 'block',
            borderRadius: '3px',
            margin: '0',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '12px',
          }}>
            {children}
          </div>
      </div>
  </div>
}
