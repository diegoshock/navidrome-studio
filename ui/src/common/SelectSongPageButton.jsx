import { Button, useListContext } from 'react-admin'
import SelectAllIcon from '@material-ui/icons/SelectAll'
import { useStudioLabels } from '../studio/useStudioLabels'

export const SelectSongPageButton = () => {
  const { ids, data, selectedIds, onSelect } = useListContext()
  const labels = useStudioLabels()
  const eligible = ids.filter((id) => !data[id]?.missing)
  return (
    <Button
      label={labels.selectPage}
      disabled={eligible.every((id) => selectedIds.includes(id))}
      onClick={() => onSelect([...new Set([...selectedIds, ...eligible])])}
    >
      <SelectAllIcon />
    </Button>
  )
}
