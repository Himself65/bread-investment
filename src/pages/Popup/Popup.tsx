import './Popup.css'

import { Paper } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useLocalStore } from 'mobx-react'
import React from 'react'
import { useAsync, useList } from 'react-use'

import { getFunds, getIndexFunds } from '../../api'
import IndexFundsGrid from '../../components/IndexFundsGrid'
import FundsTable from '../../components/InvestmentTable'
import { marketIndexes } from '../../data'
import { createUserSettings } from '../../store'
import { Index, Investment } from '../../type'
import { initUserSettings } from '../../util'

const MarketIndexes: React.FC = () => {
  const [indexes, { set: setIndexes }] = useList<Index>([])
  useAsync(async () => {
    const index = await getIndexFunds(marketIndexes.map(index => index.id))
    setIndexes(index)
  }, [])
  return (
    <React.Fragment>
      <IndexFundsGrid indexes={indexes}/>
    </React.Fragment>
  )
}

const Popup: React.FC = () => {
  const userSettings = useLocalStore(createUserSettings)
  const [investments, { set: setInvestments }] = useList<Investment>([])
  useAsync(async () => {
    const products = [] as Investment[]
    await initUserSettings(userSettings)
    // load fund list
    const funds = await getFunds(userSettings.selectedProductIDs, userSettings.userID)
    products.push(...funds)
    setInvestments(products)

    // load stock list
    // todo
  }, [userSettings])
  return (
    <Paper className='App'>
      <CssBaseline/>
      <MarketIndexes/>
      <FundsTable investments={investments}/>
    </Paper>
  )
}

export default Popup
