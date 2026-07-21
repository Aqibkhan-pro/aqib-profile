import { AfterViewInit, Component, HostListener, OnDestroy, signal } from '@angular/core';

type GalleryImage = {
  src: string;
  title: string;
  caption: string;
};

type GalleryKey = 'bemis' | 'mobileSentrixWeb' | 'techbarHrms' | 'techbarPosHrms';

type GalleryProject = {
  eyebrow: string;
  images: GalleryImage[];
};

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('aqib-profile');
  protected readonly galleryOpen = signal(false);
  protected readonly activeGalleryKey = signal<GalleryKey>('bemis');
  protected readonly activeGalleryIndex = signal(0);
  protected readonly bemisGallery: GalleryImage[] = [
    {
      src: 'projects/bemis-portal-home.png',
      title: 'EMIS Web Portal',
      caption: 'Education governance portal with access to EMIS modules and reporting.',
    },
    {
      src: 'projects/bemis-dashboard-risk.png',
      title: 'Student Dropout Dashboard',
      caption: 'Focused school, enrollment and risk analytics for operational monitoring.',
    },
    {
      src: 'projects/bemis-education-dashboard.png',
      title: 'Education Dashboard',
      caption: 'Province-wide school, student and distribution reporting console.',
    },
    {
      src: 'projects/bemis-gis-reports.png',
      title: 'GIS Reports',
      caption: 'Interactive GIS reporting with filters, base maps and district overlays.',
    },
    {
      src: 'projects/bemis-map-view.png',
      title: 'School Mapping',
      caption: 'Map-first school exploration with ownership, level and type filters.',
    },
    {
      src: 'projects/bemis-sql-templates.png',
      title: 'Advanced Templates',
      caption: 'Dynamic SQL templates for configurable monitoring and census reports.',
    },
    {
      src: 'projects/bemis-dashboard-cards.png',
      title: 'Dashboard Cards',
      caption: 'Executive KPI cards for schools, enrollment and dropout prevention.',
    },
    {
      src: 'projects/bemis-monitoring-reports.png',
      title: 'Monitoring Reports',
      caption: 'District and indicator monitoring reports with searchable filters.',
    },
  ];
  protected readonly techbarHrmsGallery: GalleryImage[] = [
    {
      src: 'projects/mobile-sentrix-clock.png',
      title: 'Techbar Attendance',
      caption: 'HRMS clock-in dashboard with attendance status, quick actions and mobile navigation.',
    },
    {
      src: 'projects/mobile-sentrix-dashboard.png',
      title: 'Employee Dashboard',
      caption: 'Employee summary dashboard with tasks, attendance and quick workflow access.',
    },
    {
      src: 'projects/mobile-sentrix-scheduler.png',
      title: 'Schedule Management',
      caption: 'Employee schedule screen with dates, shifts, role details and attendance actions.',
    },
    {
      src: 'projects/mobile-sentrix-chat.png',
      title: 'Team Chat',
      caption: 'Real-time team messaging and communication entry points for HRMS users.',
    },
    {
      src: 'projects/mobile-sentrix-tasks.png',
      title: 'Task Management',
      caption: 'Task list with priority, status, assignments and quick task handling.',
    },
    {
      src: 'projects/mobile-sentrix-documents.png',
      title: 'Document Handling',
      caption: 'Document workflow screen for employee records, requests and recent files.',
    },
    {
      src: 'projects/mobile-sentrix-notifications.png',
      title: 'Notifications',
      caption: 'Notification center for tasks, reminders, documents and HR updates.',
    },
    {
      src: 'projects/mobile-sentrix-settings.png',
      title: 'Settings',
      caption: 'Mobile app settings for attendance, chat, notifications and user preferences.',
    },
  ];
  protected readonly mobileSentrixWebGallery: GalleryImage[] = [
    {
      src: 'projects/ms-web-dashboard.png',
      title: 'Mobile Sentrix Web Dashboard',
      caption: 'Angular admin dashboard for the Mobile Sentrix operations platform.',
    },
    {
      src: 'projects/ms-web-chat.png',
      title: 'Chat Module',
      caption: 'Team messaging, group activity, video call entry points and conversation tools.',
    },
    {
      src: 'projects/ms-web-blog-dashboard.png',
      title: 'Blog Dashboard',
      caption: 'Content management dashboard with posts, views, publishing and comments metrics.',
    },
    {
      src: 'projects/ms-web-hr-employees.png',
      title: 'HR Employee Management',
      caption: 'Employee directory with searchable tables, roles, departments and pagination.',
    },
    {
      src: 'projects/ms-web-scheduler.png',
      title: 'Weekly Scheduler',
      caption: 'HR scheduling interface with employee shifts, weekly views and time blocks.',
    },
    {
      src: 'projects/ms-web-device-control.png',
      title: 'Device Control',
      caption: 'Terminal, user verification and map-based device control workflows.',
    },
    {
      src: 'projects/ms-web-drive.png',
      title: 'Document Drive',
      caption: 'Document control drive with recent files, folders, list view and detail panel.',
    },
  ];
  protected readonly techbarPosHrmsGallery: GalleryImage[] = [
    {
      src: 'projects/techbar-hrms-dashboard-dark.png',
      title: 'HRMS Dashboard',
      caption: 'Dark HRMS dashboard with schedule, approvals and asset overview.',
    },
    {
      src: 'projects/techbar-hrms-clockin-dark.png',
      title: 'Clock-In Dashboard',
      caption: 'Dark attendance screen with clock-in timer, breaks and schedule information.',
    },
    {
      src: 'projects/techbar-hrms-login.png',
      title: 'HRMS Login',
      caption: 'Dark HRMS sign-in screen with branded onboarding and authentication flow.',
    },
    {
      src: 'projects/techbar-hrms-documents.png',
      title: 'Document Control',
      caption: 'Document hub for drive, document requests, trash and archive workflows.',
    },
  ];
  protected readonly galleryProjects: Record<GalleryKey, GalleryProject> = {
    bemis: {
      eyebrow: 'EMIS Module Gallery',
      images: this.bemisGallery,
    },
    mobileSentrixWeb: {
      eyebrow: 'Mobile Sentrix Web Gallery',
      images: this.mobileSentrixWebGallery,
    },
    techbarHrms: {
      eyebrow: 'Techbar HRMS Mobile Gallery',
      images: this.techbarHrmsGallery,
    },
    techbarPosHrms: {
      eyebrow: 'POS & HR Platform Gallery',
      images: this.techbarPosHrmsGallery,
    },
  };
  private cleanup: Array<() => void> = [];
  private revealObserver?: IntersectionObserver;

  protected get activeGalleryProject(): GalleryProject {
    return this.galleryProjects[this.activeGalleryKey()];
  }

  protected get activeGalleryImages(): GalleryImage[] {
    return this.activeGalleryProject.images;
  }

  protected get activeGalleryImage(): GalleryImage {
    return this.activeGalleryImages[this.activeGalleryIndex()] ?? this.activeGalleryImages[0];
  }

  ngAfterViewInit(): void {
    this.setupTheme();
    this.setupMobileNav();
    this.setupRevealAnimations();
  }

  ngOnDestroy(): void {
    this.cleanup.forEach((fn) => fn());
    this.revealObserver?.disconnect();
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown', ['$event'])
  protected onGalleryKeydown(event: KeyboardEvent): void {
    if (!this.galleryOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeGallery();
    } else if (event.key === 'ArrowRight') {
      this.showNextGalleryImage();
    } else if (event.key === 'ArrowLeft') {
      this.showPreviousGalleryImage();
    }
  }

  protected openGallery(key: GalleryKey, index = 0, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activeGalleryKey.set(key);
    this.activeGalleryIndex.set(index);
    this.galleryOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closeGallery(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.galleryOpen.set(false);
    document.body.style.overflow = '';
  }

  protected showNextGalleryImage(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activeGalleryIndex.update((index) => (index + 1) % this.activeGalleryImages.length);
  }

  protected showPreviousGalleryImage(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activeGalleryIndex.update(
      (index) => (index - 1 + this.activeGalleryImages.length) % this.activeGalleryImages.length,
    );
  }

  protected selectGalleryImage(index: number, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activeGalleryIndex.set(index);
  }

  private setupTheme(): void {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const storage =
      typeof window.localStorage?.getItem === 'function' &&
      typeof window.localStorage?.setItem === 'function'
        ? window.localStorage
        : undefined;
    let storedTheme: string | null = null;

    try {
      storedTheme = storage?.getItem('theme') ?? null;
    } catch {
      storedTheme = null;
    }

    if (storedTheme) {
      root.setAttribute('data-theme', storedTheme);
    } else if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
    }

    if (!themeToggle) {
      return;
    }

    const onToggleTheme = () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        storage?.setItem('theme', next);
      } catch {
        // Ignore unavailable storage in test or restricted browser contexts.
      }
    };

    themeToggle.addEventListener('click', onToggleTheme);
    this.cleanup.push(() => themeToggle.removeEventListener('click', onToggleTheme));
  }

  private setupMobileNav(): void {
    const mobileNav = document.getElementById('mnav');
    const openButton = document.getElementById('burger-open');
    const closeButton = document.getElementById('burger-close');

    if (!mobileNav || !openButton || !closeButton) {
      return;
    }

    const openNav = () => mobileNav.classList.add('open');
    const closeNav = () => mobileNav.classList.remove('open');

    openButton.addEventListener('click', openNav);
    closeButton.addEventListener('click', closeNav);
    this.cleanup.push(() => openButton.removeEventListener('click', openNav));
    this.cleanup.push(() => closeButton.removeEventListener('click', closeNav));

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
      this.cleanup.push(() => link.removeEventListener('click', closeNav));
    });
  }

  private setupRevealAnimations(): void {
    const elements = document.querySelectorAll('.reveal, .bar');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('in'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach((element) => this.revealObserver?.observe(element));
  }
}
