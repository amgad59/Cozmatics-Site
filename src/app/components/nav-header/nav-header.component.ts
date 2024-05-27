import { ButtonModule } from 'primeng/button';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, EventEmitter, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { IUser } from '../../shared/models/user';
import { ICart } from '../../shared/models/cart';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../shared/services/cart/cart.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { IDropList } from '../../shared/models/city';
import { IAddress } from '../../shared/models/address';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { InputMaskModule } from 'primeng/inputmask';

type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule, NgFor, TrimDecimalPipe, CommonModule, InputNumberModule, BadgeModule, DialogModule, ReactiveFormsModule, InputMaskModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent implements OnInit, AfterViewInit, DoCheck {
	sidebarVisible: boolean = false;
	countries: Droplist[] | undefined;
	users: Droplist[] | undefined;
	user!: IUser;
	selectedLanguage!: Droplist;
	selectedUsers!: Droplist;
	carts!: ICart[];
	cartsReq!: ICart[];
	qty: number = 1;
	visible: boolean = false;
	visibleCardDialog: boolean = false;
	cities: IDropList[] | undefined;
	deliveryType!: IDropList;
	address!: IAddress;
	AddressForm!: FormGroup;
	submitted: boolean = false;
	submittedCardForm: boolean = false;
	totalPrice: number = 0;
	deliveryStatus!: IDropList[];
	objQty!: any[];
	cardForm!: FormGroup;
	constructor(
		private router: Router,
		public sanitizer: DomSanitizer,
		private loadingService: LoadingService,
		public cartService: CartService,
		@Inject(PLATFORM_ID) private platformId: object,
		private toastrSerice: ToastrService,
		private fb: FormBuilder,
		private paymentService: PaymentService
	) { }

	ngOnInit() {
		this.getUserInfo();
		this.handleDroplist();
		this.getOrdersInCart();
		this.getAddressByCustNo();
		this.createAddressForm();
		this.initCardForm();
		this.cities = [
			{ name: 'New York', code: 'NY' },
			{ name: 'Rome', code: 'RM' },
			{ name: 'London', code: 'LDN' },
			{ name: 'Istanbul', code: 'IST' },
			{ name: 'Paris', code: 'PRS' }
		];

		this.deliveryStatus = [
			{ name: 'Home', code: 0 },
			{ name: 'Shop', code: 1 }
		];
	}


	pushQty() {
		if (!this.objQty) {
			this.objQty = [
				{ "qty": 1 }
			]
		} else {
			this.objQty.push({ "qty": 1 })
		}
	}

	ngAfterViewInit(): void {
	}

	createAddressForm() {
		this.AddressForm = this.fb.group({
			city: ["", Validators.required],
			area: ["", Validators.required],
			street: ["", Validators.required],
			customerId: ["", Validators.required]
		})
	}

	getUserInfo() {
		if (isPlatformBrowser(this.platformId)) {
			const user = localStorage.getItem("user")
			if (user)
				this.user = JSON.parse(user);
		}
	}

	ngDoCheck() {
		this.getUserInfo();
	}

	handleDroplist(): void {
		this.countries = [
			{ name: 'العربية', code: 'AR', image: "assets/Flag_of_Saudi_Arabia.svg.webp" },
			{ name: 'English', code: 'EN', image: "assets/download.png" },
		];
		this.users = [
			{ name: 'Login', code: 'login' },
			{ name: 'Register', code: 'register' }
		];
		this.selectedLanguage = this.countries[1];
	}

	getOrdersInCart() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) {
				this.carts = JSON.parse(carts);
				this.cartsReq = JSON.parse(carts);
			}
		}
	}

	getAddressByCustNo() {
		if (this.user?.userId) {
			this.cartService.addressByCustNo(this.user.userId).subscribe((res: any) => {
				this.address = res[0];
				if (this.loadingService.show) {
					this.loadingService.hideLoading();
				}
			})
		}
	}

	navigateToSign(path: Droplist) {
		this.router.navigate([path.code]);
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	showSideBar() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts")
			if (carts) {
				this.carts = JSON.parse(carts);
				this.cartsReq = JSON.parse(carts);
				this.totalPrice = this.cartsReq.reduce((accumulator: number, res: ICart) => (res.discountPercentage ? ((+res.discountPercentage / +res.price) * 100) : res.price) + accumulator, 0);
				this.cartsReq.forEach(res => {
					this.pushQty();
				})
			}
			this.sidebarVisible = true;
		}
	}

	clear(id: number) {
		this.carts = this.carts.filter(res => res.id !== id);
		this.totalPrice = this.carts.reduce((accumulator: number, res: ICart) => res.price + accumulator, 0);
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem("carts", JSON.stringify(this.carts));
		}
	}

	navigateToHome() {
		this.router.navigate(['home']);
	}

	saveAddress() {
		this.AddressForm.get("customerId")?.patchValue(this.user.userId);
		this.submitted = true;
		if (this.AddressForm.valid) {
			this.submitted = false;
			this.cartService.createAddress(this.AddressForm.getRawValue()).subscribe(res => {
				if (res) {
					this.getAddressByCustNo();
					this.visible = false;
					this.toastrSerice.success("Adrress saved Successfully", "Success");
				}
			})
		}

	}

	changeTotalPrice(event: number, id: number) {
		this.cartsReq = this.cartsReq.map(res => {
			if (res.id === id) res.qty = event;
			return res
		});
		this.totalPrice = this.cartsReq.reduce((accumulator: number, res: ICart) => ((res.discountPercentage ? ((+res.discountPercentage / +res.price) * 100) : res.price) * res.qty) + accumulator, 0);
	}

	showDialog() {
		this.visible = true;
	}

	paymentOrder(order: any) {
		this.paymentService.executePayment({ PaymentMethodId: "20", InvoiceValue: this.totalPrice }).subscribe((res: any) => {
			const data = { PaymentMethodId: 20, InvoiceValue: this.totalPrice, Card: { ...this.cardForm.getRawValue() }, Bypass3DS: false };
			this.paymentService.DirectPayment(res.Data.PaymentURL, data).subscribe((response: any) => {
				if (response.IsSuccess) {
					this.toastrSerice.success("Order saved Successfully", "Success");
					localStorage.removeItem("carts");
				} else {
					this.cartService.cancelOrder(order.OrderID).subscribe();
				}
			});
		})
	}

	placeOrderReq() {
		this.cartService.placeOrder(this.cartsReq, (this.address && this.address.id) ? this.address.id : null, this.deliveryType.code).subscribe((order: any) => {
			this.loadingService.hideLoading();
			if (order?.rejectedProductIds.length) {
				Swal.fire({
					title: 'Quantities of these following products is not available now',
					icon: 'error',
					html: `
					${order.rejectedProductIds.map((element: any) => (
						`<div>
								<span style="display: block">Product Name: ${element.productId}</span>
								<span style="display: block">Attribute : ${element.attrValueId}</span>
						</div>`
					))
						}
					`,
					confirmButtonText: 'Ok'
				}).then((res: SweetAlertResult) => {
					if (res.isConfirmed) {
						this.paymentOrder(order);
					} else {
						this.cartService.cancelOrder(order.OrderID).subscribe();
					}
				});
			} else {
				this.paymentOrder(order);
			};
		})
	}

	placeOrder() {
		if (this.user) {
			if (this.deliveryType.code === 0 && !this.address?.id) {
				this.showDialog();
				return;
			};
			this.placeOrderReq();
		} else {
			this.toastrSerice.error("Please log in first", "Error");
		};
	}

	logOut() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
		this.loadingService.appearLoading();
		location.reload();
	}

	showCardDialog() {
		this.visibleCardDialog = true;
	}


	initCardForm() {
		this.cardForm = this.fb.group({
			Number: ["", Validators.required],
			ExpiryMonth: ["", Validators.required],
			ExpiryYear: ["", Validators.required],
			SecurityCode: ["", Validators.required]
		})
	}


	saveCard() {
		this.submittedCardForm = true;
		if (this.cardForm.status === "VALID") {
			this.visibleCardDialog = false;
			this.submittedCardForm = false;
		}
	}
}
