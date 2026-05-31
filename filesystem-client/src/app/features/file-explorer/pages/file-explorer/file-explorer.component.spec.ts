import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileExplorerComponent } from './file-explorer.component';
import { of } from 'rxjs';

describe('FileExplorerComponent', () => {
  let component: FileExplorerComponent;
  let fixture: ComponentFixture<FileExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format permissions correctly', () => {
    expect(component.formatPermissions('755')).toBe('rwxr-xr-x');
  });
});