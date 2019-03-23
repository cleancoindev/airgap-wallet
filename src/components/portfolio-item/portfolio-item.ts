import { Component, Input } from '@angular/core'
import { AirGapMarketWallet } from 'airgap-coin-lib'
import { OperationsProvider } from '../../providers/operations/operations'
import { WebExtensionProvider } from '../../providers/web-extension/web-extension'
import { AccountProvider } from '../../providers/account/account.provider'
import { Observable } from 'rxjs'

const XTZ_KT = 'xtz-kt'

@Component({
  selector: 'portfolio-item',
  templateUrl: 'portfolio-item.html'
})
export class PortfolioItemComponent {
  public isActive: boolean = false

  @Input()
  wallet: AirGapMarketWallet

  @Input()
  maxDigits: number = 0

  @Input()
  isToken: boolean = false

  @Input()
  isDelegated: Observable<boolean>

  constructor(
    private readonly operationsProvider: OperationsProvider,
    public webExtensionProvider: WebExtensionProvider,
    public accountProvider: AccountProvider
  ) {}

  ngOnInit(): void {
    if (this.webExtensionProvider.isWebExtension()) {
      this.accountProvider.activeAccountSubject.subscribe(activeAccount => {
        if (this.wallet && activeAccount) {
          this.isActive = this.accountProvider.isSameWallet(this.wallet, activeAccount)
        }
      })
    }
  }

  async ngOnChanges() {
    if (this.wallet && this.wallet.protocolIdentifier === XTZ_KT) {
      this.isDelegated = await this.operationsProvider.getDelegationStatusObservableOfAddress(this.wallet.receivingPublicAddress)
    }
  }
}
