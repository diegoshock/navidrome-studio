import React from 'react'
import { useTranslate } from 'react-admin'

export const Title = ({ subTitle, args }) => {
  const translate = useTranslate()
  const text = translate(subTitle, { ...args, _: subTitle })

  return <span>{text ? text : 'Navidrome'}</span>
}
