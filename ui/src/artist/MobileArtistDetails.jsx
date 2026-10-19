import React, { useState } from 'react'
import { Typography, Collapse } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import config from '../config'
import { LoveButton, RatingField, ImageUploadOverlay } from '../common'
import Lightbox from 'react-image-lightbox'
import subsonic from '../subsonic'
import { SafeHTML } from '../common/SafeHTML'
import { Artwork } from '../common/Artwork'

const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: 'flex',
    },
    bgContainer: {
      display: 'flex',
      minHeight: '9rem',
      gap: 16,
      width: '100%',
      padding: 'unset',
      backgroundPosition: '50% 30%',
    },
    link: {
      margin: '1px',
    },
    details: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: 0,
    },
    biography: {
      display: 'flex',
      marginTop: 16,
      width: '100%',
      zIndex: '1',
      '& p': {
        whiteSpace: ({ expanded }) => (expanded ? 'unset' : 'nowrap'),
        overflow: 'hidden',
        width: '100%',
        textOverflow: 'ellipsis',
      },
    },
    cover: {
      width: 151,
      boxShadow: 'none',
      borderRadius: '5px',
      backgroundColor: 'transparent',
      transition: 'opacity 0.3s ease-in-out',
      objectFit: 'cover',
    },
    artistImage: {
      marginLeft: 0,
      maxHeight: '7rem',
      backgroundColor: 'inherit',
      marginTop: 0,
      width: '7rem',
      minWidth: '7rem',
      display: 'flex',
      borderRadius: 4,
      position: 'relative',
    },
    loveButton: {
      top: theme.spacing(-0.2),
      left: theme.spacing(0.5),
    },
    rating: {
      marginTop: '5px',
    },
    artistName: {
      wordBreak: 'break-word',
    },
  }),
  { name: 'NDMobileArtistDetails' },
)

const MobileArtistDetails = ({ biography, record }) => {
  const img = subsonic.getCoverArtUrl(record, 800)
  const [expanded, setExpanded] = useState(false)
  const classes = useStyles({ img, expanded })
  const title = record.name
  const [isLightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className={classes.root}>
        <div className={classes.bgContainer}>
          <Card className={classes.artistImage}>
            <Artwork
              record={record}
              className={classes.cover}
              title={title}
              onClick={() => setLightboxOpen(true)}
            />
            <ImageUploadOverlay
              entityType="artist"
              entityId={record.id}
              hasUploadedImage={!!record.uploadedImage}
            />
          </Card>
          <div className={classes.details}>
            <Typography
              component="h1"
              variant="h5"
              className={classes.artistName}
            >
              {title}
              <LoveButton
                className={classes.loveButton}
                record={record}
                resource={'artist'}
                size={'small'}
                aria-label="love"
                color="primary"
              />
            </Typography>
            {config.enableStarRating && (
              <RatingField
                record={record}
                resource={'artist'}
                size={'small'}
                className={classes.rating}
              />
            )}
          </div>
        </div>
      </div>
      <div className={classes.biography}>
        <Collapse collapsedHeight={'1.5em'} in={expanded} timeout={'auto'}>
          <Typography variant={'body1'} onClick={() => setExpanded(!expanded)}>
            <span>
              <SafeHTML>{biography}</SafeHTML>
            </span>
          </Typography>
        </Collapse>
      </div>
      {isLightboxOpen && (
        <Lightbox
          imagePadding={50}
          animationDuration={200}
          imageTitle={record.name}
          mainSrc={img}
          onCloseRequest={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

export default MobileArtistDetails
