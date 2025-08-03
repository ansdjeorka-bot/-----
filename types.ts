
export interface Client {
  id: string;
  name: string;
  address: string;
  visited: boolean;
}

export type DayOfWeek = '월' | '화' | '수' | '목' | '금' | '토' | '일';